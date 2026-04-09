<?php

namespace App\Http\Requests\Admin\Concerns;

trait PostUploadValidationMessages
{
    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'document.uploaded' => 'El servidor no recibió el archivo. Suele deberse a que supera el límite de subida de PHP (upload_max_filesize / post_max_size). En local, usa el script composer run dev del proyecto; en producción, sube esos límites en php.ini o en la configuración del servidor web.',
            'featured_image.uploaded' => 'El servidor no recibió la imagen de portada. Revisa los límites upload_max_filesize y post_max_size de PHP.',
        ];
    }
}
