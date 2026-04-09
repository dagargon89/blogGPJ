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
            'featured_image.uploaded' => 'El servidor no recibió la imagen de portada (máx. 5 MB en la app). Revisa upload_max_filesize y post_max_size en PHP.',
        ];
    }
}
