import type { Area } from 'react-easy-crop';

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.src = url;
    });
}

/**
 * Exporta el recorte a JPEG para un peso razonable en portadas.
 */
export async function getCroppedImageFile(
    imageSrc: string,
    pixelCrop: Area,
    fileName = 'cover.jpg',
): Promise<File> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));

                    return;
                }

                resolve(new File([blob], fileName, { type: 'image/jpeg' }));
            },
            'image/jpeg',
            0.92,
        );
    });
}
