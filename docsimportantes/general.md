# Documento de especificaciones técnicas (TDD)

**Proyecto:** Hub de Conocimiento Organizacional (blog interno)

## 1. Arquitectura del sistema

El sistema es una **aplicación monolítica** sobre Laravel, con dos caras claras en la misma base de código:

- **Sitio principal (consumo de contenido):** rutas públicas o autenticadas según reglas de negocio, renderizadas con **Inertia.js** y **React**.
- **Panel administrativo (gestión de contenido):** rutas bajo un prefijo acordado (por ejemplo `/admin`), protegidas con middleware `auth` y, cuando exista, **policies**, **gates** y/o roles; mismas tecnologías (**Inertia + React**) y convenciones que el sitio (layouts, formularios, **Laravel Wayfinder** para URLs tipadas en el frontend).

| Capa | Tecnología |
|------|------------|
| Backend | **Laravel 13**, **PHP 8.4** |
| Autenticación | **Laravel Fortify** (u stack ya definido en el proyecto) |
| Frontend | **React 19** + **Inertia.js v3** |
| Estilos | **Tailwind CSS v4** |
| Base de datos | **MySQL 8.0+** (u motor configurado en el proyecto) |
| Archivos (imágenes / documentos) | **Firebase Storage** vía driver **Google Cloud Storage** (`league/flysystem-google-cloud-storage`) |

No se utiliza **Filament** ni paneles PHP separados para el admin: el panel es parte de la SPA Inertia.

### 1.1 Roles y permisos

La tabla `users` puede permanecer como en Laravel por defecto. Los roles y permisos no requieren columnas extra en `users` si se usan tablas de paquetes dedicados.

**Recomendación documentada:** [spatie/laravel-permission](https://github.com/spatie/laravel-permission) (roles/permisos en BD + helpers) combinado con **Policies** por modelo (`Post`, `Category`, etc.). La instalación y migraciones concretas dependen de la decisión del equipo al implementar.

---

## 2. Esquema de base de datos (relacional)

Laravel incluye migraciones por defecto (`users`, `password_reset_tokens`, jobs, etc.). Lo siguiente amplía el modelo de datos del blog.

### 2.1 Tabla: `users`

Estructura estándar de Laravel:

- `id` (bigint, unsigned, auto_increment)
- `name` (varchar)
- `email` (varchar, unique)
- `email_verified_at` (timestamp, nullable)
- `password` (varchar)
- `remember_token` (varchar)
- `created_at`, `updated_at`

### 2.2 Tabla: `categories`

Organización principal del contenido.

- `id` (bigint, unsigned, auto_increment)
- `name` (varchar) — ej.: "Inteligencia Artificial", "Recursos Humanos"
- `slug` (varchar, unique) — ej.: `inteligencia-artificial`
- `description` (text, nullable)
- `icon` (varchar, nullable) — clase de icono o URL (opcional)
- `created_at`, `updated_at`

### 2.3 Tabla: `posts`

Contenido central.

- `id` (bigint, unsigned, auto_increment)
- `user_id` (bigint, unsigned, FK → `users.id`)
- `category_id` (bigint, unsigned, FK → `categories.id`)
- `title` (varchar)
- `slug` (varchar, unique)
- `excerpt` (text) — resumen para tarjetas
- `content` (longtext) — HTML o JSON según el editor
- `content_type` (enum: `article`, `video`, `infographic`, `document`) — determina cómo React renderiza el post
- `status` (enum: `draft`, `published`, `archived`)
- `featured_image_path` (varchar, nullable) — ruta en el disco de archivos (p. ej. GCS)
- `youtube_video_id` (varchar, nullable) — ej.: `dQw4w9WgXcQ`; solo si `content_type` es `video`
- `document_path` (varchar, nullable) — PDF u otro archivo en almacenamiento; si `content_type` es `infographic` o `document`
- `published_at` (timestamp, nullable)
- `created_at`, `updated_at`
- `deleted_at` (timestamp, nullable) — soft deletes

### 2.4 Tabla: `tags`

Etiquetas transversales (ej.: herramientas, comunicación).

- `id` (bigint, unsigned, auto_increment)
- `name` (varchar)
- `slug` (varchar, unique)
- `created_at`, `updated_at`

### 2.5 Tabla: `post_tag` (pivote)

Relación muchos a muchos entre posts y tags.

- `post_id` (bigint, unsigned, FK → `posts.id`)
- `tag_id` (bigint, unsigned, FK → `tags.id`)
- Clave primaria compuesta: (`post_id`, `tag_id`)

---

## 3. Almacenamiento (Firebase / Google Cloud Storage)

Firebase Storage se apoya en GCS. Integración en Laravel mediante Flysystem.

**Paquete:** `composer require league/flysystem-google-cloud-storage`

En `config/filesystems.php` se define un disco dedicado, por ejemplo `firebase`, que usarán los controladores al guardar y leer archivos:

```php
'firebase' => [
    'driver' => 'gcs',
    'key_file_path' => env('GOOGLE_CLOUD_KEY_FILE', base_path('firebase-credentials.json')),
    'key_file' => [],
    'project_id' => env('GOOGLE_CLOUD_PROJECT_ID', 'tu-proyecto-id'),
    'bucket' => env('GOOGLE_CLOUD_STORAGE_BUCKET', 'tu-proyecto-id.appspot.com'),
    'path_prefix' => env('GOOGLE_CLOUD_STORAGE_PATH_PREFIX', ''),
    'storage_api_uri' => env('GOOGLE_CLOUD_STORAGE_API_URI', null),
    'visibility' => 'public',
],
```

**Uso desde la aplicación:**

- Subidas: formularios Inertia (`multipart/form-data`) → **Form Request** de validación → controlador que llama a `Storage::disk('firebase')->put(...)` (o flujos equivalentes).
- URLs públicas: `Storage::disk('firebase')->url($path)` para exponer enlaces al frontend (portadas, PDFs, etc.).

---

## 4. Frontend (React + Inertia.js)

Inertia envía datos desde controladores Laravel a las props de las páginas React.

### 4.1 Estructura orientativa (`resources/js/`)

Convención del proyecto: páginas en **TypeScript/React** (`.tsx`), por ejemplo:

| Ruta sugerida | Propósito |
|---------------|-----------|
| `pages/Home.tsx` | Inicio con posts recientes y destacados |
| `pages/Blog/Index.tsx` | Listado paginado, filtros por categoría y búsqueda |
| `pages/Blog/Show.tsx` | Detalle; según `post.content_type` delega al renderer adecuado |
| `layouts/...` | Layout público (navbar, sidebar opcional, footer) |
| `components/cards/PostCard.tsx` | Tarjeta para grillas |
| `components/renderers/ArticleRenderer.tsx` | HTML seguro desde editor |
| `components/renderers/VideoRenderer.tsx` | iframe YouTube: `https://www.youtube.com/embed/{id}` |
| `components/renderers/DocumentRenderer.tsx` | Imagen o visor PDF con URL desde Firebase/GCS |

Los nombres exactos pueden ajustarse al árbol real bajo `resources/js/pages` y `resources/js/components`.

### 4.2 Flujo de datos (ejemplo de controlador)

```php
// app/Http/Controllers/PostController.php
public function show(Post $post)
{
    $post->load(['category', 'tags', 'author']);

    return Inertia::render('Blog/Show', [
        'post' => [
            'id' => $post->id,
            'title' => $post->title,
            'content' => $post->content,
            'type' => $post->content_type,
            'media' => [
                'cover' => $post->featured_image_path
                    ? Storage::disk('firebase')->url($post->featured_image_path)
                    : null,
                'youtube_id' => $post->youtube_video_id,
                'document' => $post->document_path
                    ? Storage::disk('firebase')->url($post->document_path)
                    : null,
            ],
            'author' => $post->author->name,
            'date' => $post->published_at?->format('d M, Y'),
        ],
    ]);
}
```

---

## 5. Panel de administración (Inertia + React)

El admin **no** usa Filament. Cada área es una **página Inertia** (y rutas REST o resource) con **Form Requests**, **Policies** y respuestas `redirect` / `Inertia::render` según corresponda.

Áreas funcionales previstas:

| Área | Descripción |
|------|-------------|
| Categorías | CRUD simple |
| Etiquetas | CRUD simple |
| Usuarios | Alta/edición de empleados o editores; asignación de roles cuando exista el paquete de permisos |
| Posts | Formulario principal: pestañas o secciones colapsables; selector `content_type` que **muestra u oculta** campos en React (estado local o props derivadas) |
| Post tipo video | Campo `youtube_video_id` |
| Post tipo documento / infografía | Subida de archivo al disco `firebase` vía request multipart |
| Post tipo artículo | Editor de texto enriquecido; persistir HTML o JSON según decisión de producto |

Rutas sugeridas: prefijo `/admin`, middleware `auth` + comprobaciones de rol/permiso cuando estén disponibles.

---

## 6. Seguridad y rendimiento

- **Autorización:** acceso a `/admin` y acciones (crear, editar, eliminar, publicar) mediante **Policies** y/o permisos (p. ej. Spatie); no depender de un panel PHP externo.
- **Optimización de imágenes:** antes o después de subir a GCS, redimensionar/comprimir (jobs, observers o librerías de imagen) según política del proyecto.
- **Caché:** `Cache::remember` (o tags si aplica) para fragmentos costosos, por ejemplo “últimos N posts” en la home, con invalidación al publicar o actualizar contenido.

---

## 7. Referencias de stack en el repositorio

Versiones y convenciones detalladas: [AGENTS.md](../AGENTS.md) en la raíz del proyecto.
