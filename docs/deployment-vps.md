# Especificación de infraestructura y configuración — blogGPJ (VPS)

Documento de referencia para preparar un servidor (VPS) que ejecute esta aplicación: **Laravel 13**, **PHP ≥ 8.3**, **Inertia + React** (Vite), **Fortify**, almacenamiento de portadas en **Google Cloud Storage** y base de datos relacional en producción.

---

## 1. Resumen del stack en runtime

| Capa | Tecnología en este repo |
|------|-------------------------|
| Backend | Laravel 13, PHP **≥ 8.3** (`composer.json`: `^8.3`) |
| Frontend | React 19 + Vite 8 + Inertia v3 (assets compilados en `public/build/`) |
| Auth | Laravel Fortify (registro, reset, verificación email, 2FA) |
| HTTP | Servidor web con **PHP-FPM** (recomendado: **Nginx**) |
| Base de datos | **MySQL/MariaDB** o **PostgreSQL** en producción (`.env.example` usa SQLite solo como referencia local) |
| Sesiones | Tabla `sessions` con `SESSION_DRIVER=database` |
| Caché | Tabla `cache` con `CACHE_STORE=database` |
| Colas | Tablas `jobs` / `failed_jobs` con `QUEUE_CONNECTION=database` |
| Portadas (admin) | Disco **`firebase`** → **Google Cloud Storage** (`config/filesystems.php`, `Admin/PostController`) |
| Health check | `GET /up` (`bootstrap/app.php`) |

**Node.js** no es obligatorio en el VPS **después** de compilar el front; en runtime bastan PHP + Nginx + `public/build/` generado.

---

## 2. Software que debe existir en el VPS

### 2.1 Obligatorio

1. **PHP 8.3 o superior** con **PHP-FPM** (mismo runtime que use Nginx).
2. Extensiones PHP habituales para Laravel 13: `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `hash`, `mbstring`, `openssl`, `pcre`, `pdo`, `session`, `tokenizer`, `xml`, `json`, `bcmath`, `zip`.
3. **Extensión PDO** del motor elegido: `pdo_mysql` (MariaDB/MySQL) o `pdo_pgsql` (PostgreSQL).
4. **Composer 2**.
5. **Servidor web** con document root en `public/` y enrutamiento tipo Laravel (`try_files` → `index.php`).
6. **Base de datos relacional** (usuario dedicado, base vacía; en MySQL/MariaDB usar `utf8mb4`).

### 2.2 Si compilas el front en el servidor

- **Node.js** (LTS, p. ej. 20.x o 22.x) y **npm**.
- `npm ci` (o `npm install`) y `npm run build` → debe existir `public/build/manifest.json`.

### 2.3 Recomendado

- **Certbot** (Let’s Encrypt) para HTTPS.
- **Supervisor** o **systemd** para `php artisan queue:work` si usas colas en producción.
- **Cron** para `php artisan schedule:run` (hoy `routes/console.php` casi no define tareas programadas; conviene dejarlo por si se añaden después).

---

## 3. Límites de subida HTTP y PHP (panel admin)

La imagen de portada valida como **máximo 5120 KB** (`StorePostRequest` / `UpdatePostRequest`: `featured_image` → `max:5120`).

Valores alineados en el repo:

- `deployment/php-upload-limits.ini`: `upload_max_filesize = 20M`, `post_max_size = 32M`
- `deployment/nginx-upload-limits.conf`: `client_max_body_size 32m;`

Configurar **Nginx y PHP-FPM**: si Nginx limita el cuerpo a 1M, obtendrás **413** aunque PHP esté bien.

---

## 4. Variables de entorno (`.env`) en producción

Partir de `.env.example` y ajustar como mínimo:

### 4.1 Aplicación

| Variable | Producción |
|----------|------------|
| `APP_NAME` | Nombre del sitio |
| `APP_ENV` | `production` |
| `APP_KEY` | `php artisan key:generate` |
| `APP_DEBUG` | `false` |
| `APP_URL` | URL pública con `https`, sin barra final |
| `APP_LOCALE` / `APP_FALLBACK_LOCALE` | Opcional (p. ej. `es`) |

### 4.2 Base de datos

Definir `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (MySQL/MariaDB o PostgreSQL). Ejecutar `php artisan migrate --force`.

### 4.3 Sesión, caché y cola (valores típicos de este proyecto)

| Variable | Valor |
|----------|--------|
| `SESSION_DRIVER` | `database` |
| `CACHE_STORE` | `database` |
| `QUEUE_CONNECTION` | `database` |

### 4.4 Correo (Fortify)

Fortify incluye registro, reset de contraseña, verificación de email y 2FA (`config/fortify.php`). Configurar `MAIL_*` con un SMTP real en producción. Con `MAIL_MAILER=log` los correos no salen del servidor (solo desarrollo/pruebas).

### 4.5 Google Cloud Storage (portadas)

| Variable | Descripción |
|----------|-------------|
| `GOOGLE_CLOUD_PROJECT_ID` | ID del proyecto GCP |
| `GOOGLE_CLOUD_STORAGE_BUCKET` | Nombre del bucket |
| `GOOGLE_CLOUD_KEY_FILE` | Ruta absoluta al JSON de cuenta de servicio (recomendado fuera del webroot, p. ej. `storage/app/private/gcs-key.json`) |
| `GOOGLE_CLOUD_STORAGE_PATH_PREFIX` | Opcional |
| `GOOGLE_CLOUD_STORAGE_API_URI` | Opcional |

Permisos del JSON: restrictivos (`chmod 600`). La cuenta de servicio necesita permisos de escritura en el bucket; la lectura pública depende de la política del bucket y de la configuración del disco (`visibility` en `config/filesystems.php`).

### 4.6 Vite

| Variable | Uso |
|----------|-----|
| `VITE_APP_NAME` | Sustitución en build; suele igualarse a `APP_NAME` |

Las `VITE_FIREBASE_*` del `.env.example` solo son necesarias si el cliente usa el SDK web para algo concreto.

### 4.7 Disco por defecto

`FILESYSTEM_DISK` por defecto es `local`; las portadas usan el disco `firebase` explícitamente en código.

---

## 5. Comandos de despliegue (orden recomendado)

1. Actualizar código (`git pull` o despliegue de artefacto).
2. `composer install --no-dev --optimize-autoloader`
3. `npm ci && npm run build` (si compilas en el VPS).
4. `php artisan migrate --force`
5. `php artisan storage:link`
6. Permisos de escritura en `storage/` y `bootstrap/cache/` para el usuario de PHP-FPM.
7. Optimización: `php artisan config:cache`, `php artisan route:cache`, `php artisan view:cache`
8. Reiniciar **PHP-FPM** tras cambios relevantes.
9. Mantener `php artisan queue:work database` supervisado si usas la cola.

---

## 6. Nginx — requisitos

- `root` = `{ruta_app}/public`
- `try_files $uri $uri/ /index.php?$query_string`
- `fastcgi_pass` al socket/puerto correcto de PHP-FPM
- `client_max_body_size` ≥ 32m (ver `deployment/nginx-upload-limits.conf`)
- No servir `.env` ni exponer `storage/` fuera de `public/`

Ejemplo mínimo de bloque `server` y directivas PHP en la sección 9 del plan de despliegue interno o en la documentación de Laravel.

---

## 7. Seguridad

- `APP_DEBUG=false` en producción.
- Firewall: abrir solo lo necesario (p. ej. 22 restringido, 80/443 públicos).
- Backups: base de datos y bucket GCS.
- Tras incidencias: `php artisan optimize:clear` antes de depurar; volver a cachear config/rutas/vistas en producción estable.

---

## 8. Checklist final

- [ ] PHP 8.3+ FPM con extensiones PDO y habituales de Laravel
- [ ] Base de datos creada y migraciones aplicadas
- [ ] `.env` con `APP_KEY`, `APP_URL`, `APP_DEBUG=false`
- [ ] `public/build/manifest.json` presente (build Vite)
- [ ] Límites Nginx + PHP alineados para subida de portada
- [ ] GCS: JSON, variables de entorno, permisos del bucket; prueba de subida en admin
- [ ] Correo configurado si se usan flujos Fortify por email
- [ ] `queue:work` en ejecución si hay jobs en cola
- [ ] Cron `* * * * * cd /ruta && php artisan schedule:run`
- [ ] HTTPS operativo

---

## 9. Referencias en el repositorio

| Recurso | Ruta |
|---------|------|
| Ejemplo de entorno | `.env.example` |
| Límites PHP | `deployment/php-upload-limits.ini` |
| Límites Nginx | `deployment/nginx-upload-limits.conf` |
| Discos y GCS | `config/filesystems.php` |
| Subida portadas | `app/Http/Controllers/Admin/PostController.php` |
| Validación tamaño imagen | `app/Http/Requests/Admin/StorePostRequest.php`, `UpdatePostRequest.php` |
| Fortify | `config/fortify.php` |
| Health | `GET /up` |
