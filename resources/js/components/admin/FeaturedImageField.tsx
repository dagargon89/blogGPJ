import { ImagePlus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useId, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCroppedImageFile } from '@/lib/crop-image';
import { cn } from '@/lib/utils';

/** Proporción típica de portadas (blog / cards). Ajustar aquí si el diseño lo requiere. */
const COVER_ASPECT = 16 / 9;

export interface FeaturedImageFieldProps {
    label?: string;
    file: File | null;
    onFileChange: (file: File | null) => void;
    error?: string;
    /** Modo edición: permite marcar eliminación de la imagen guardada. */
    mode?: 'create' | 'edit';
    serverImageUrl?: string | null;
    serverImagePath?: string | null;
    removeFeaturedImage?: boolean;
    onRemoveFeaturedImageChange?: (remove: boolean) => void;
}

export function FeaturedImageField({
    label = 'Imagen de portada',
    file,
    onFileChange,
    error,
    mode = 'create',
    serverImageUrl = null,
    serverImagePath = null,
    removeFeaturedImage = false,
    onRemoveFeaturedImageChange,
}: FeaturedImageFieldProps) {
    const reactId = useId();
    const inputId = `featured_image_${reactId}`;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [stagingUrl, setStagingUrl] = useState<string | null>(null);
    const [stagingFile, setStagingFile] = useState<File | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [cropApplying, setCropApplying] = useState(false);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);

            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    const revokeStaging = useCallback(() => {
        if (stagingUrl) {
            URL.revokeObjectURL(stagingUrl);
        }

        setStagingUrl(null);
        setStagingFile(null);
        setCroppedAreaPixels(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
    }, [stagingUrl]);

    const closeCropDialog = useCallback(() => {
        setCropOpen(false);
        revokeStaging();
    }, [revokeStaging]);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixelsIn: Area) => {
        setCroppedAreaPixels(croppedAreaPixelsIn);
    }, []);

    const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0];
        e.target.value = '';

        if (!picked) {
            return;
        }

        if (stagingUrl) {
            URL.revokeObjectURL(stagingUrl);
        }

        const url = URL.createObjectURL(picked);
        setStagingFile(picked);
        setStagingUrl(url);
        setCropOpen(true);
    };

    const applyCrop = async () => {
        if (!stagingUrl || !croppedAreaPixels || !stagingFile) {
            return;
        }

        setCropApplying(true);

        try {
            const out = await getCroppedImageFile(stagingUrl, croppedAreaPixels, 'cover.jpg');
            onFileChange(out);
            onRemoveFeaturedImageChange?.(false);
            closeCropDialog();
        } finally {
            setCropApplying(false);
        }
    };

    const useWithoutCrop = () => {
        if (!stagingFile) {
            return;
        }

        onFileChange(stagingFile);
        onRemoveFeaturedImageChange?.(false);
        closeCropDialog();
    };

    const handleClear = () => {
        if (file) {
            onFileChange(null);

            return;
        }

        if (
            mode === 'edit' &&
            onRemoveFeaturedImageChange &&
            (serverImagePath || serverImageUrl) &&
            !removeFeaturedImage
        ) {
            onRemoveFeaturedImageChange(true);
        }
    };

    const canClear =
        Boolean(file) ||
        (mode === 'edit' &&
            Boolean(onRemoveFeaturedImageChange) &&
            Boolean(serverImageUrl || serverImagePath) &&
            !removeFeaturedImage);

    const showServerPreview =
        mode === 'edit' && !file && !removeFeaturedImage && Boolean(serverImageUrl);

    return (
        <div className="space-y-3">
            <Label htmlFor={inputId}>{label}</Label>

            {mode === 'edit' && serverImagePath && !removeFeaturedImage && !file && (
                <p className="text-xs text-muted-foreground">Ruta: {serverImagePath}</p>
            )}

            {removeFeaturedImage && !file && (
                <p className="text-sm text-amber-700 dark:text-amber-400">
                    La portada se eliminará al guardar los cambios.
                </p>
            )}

            {(previewUrl || showServerPreview) && (
                <div
                    className={cn(
                        'relative overflow-hidden rounded-lg border bg-muted',
                        'aspect-video max-h-56 w-full max-w-xl',
                    )}
                >
                    <img
                        src={previewUrl ?? serverImageUrl ?? ''}
                        alt="Vista previa de portada"
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            {!previewUrl && !showServerPreview && !removeFeaturedImage && (
                <div className="flex max-w-xl items-center justify-center rounded-lg border border-dashed border-input py-10 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2 text-center text-sm">
                        <ImagePlus className="size-8 opacity-50" />
                        <span>Ninguna imagen seleccionada</span>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
                <Input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    className="max-w-xs cursor-pointer"
                    onChange={handleFilePick}
                />
                {canClear && (
                    <Button type="button" variant="outline" size="sm" onClick={handleClear}>
                        <Trash2 className="mr-1 size-4" />
                        Quitar
                    </Button>
                )}
            </div>

            <InputError message={error} />

            <Dialog open={cropOpen} onOpenChange={(open) => !open && closeCropDialog()}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Recortar portada</DialogTitle>
                        <DialogDescription>
                            Proporción 16:9. Ajusta zoom y posición; luego aplica el recorte o usa la imagen sin
                            recortar.
                        </DialogDescription>
                    </DialogHeader>

                    {stagingUrl && (
                        <div className="relative h-72 w-full rounded-md bg-black sm:h-80">
                            <Cropper
                                image={stagingUrl}
                                crop={crop}
                                zoom={zoom}
                                aspect={COVER_ASPECT}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <Label htmlFor={`${inputId}_zoom`} className="text-xs">
                            Zoom
                        </Label>
                        <input
                            id={`${inputId}_zoom`}
                            type="range"
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={closeCropDialog}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="secondary" onClick={useWithoutCrop}>
                            Usar sin recortar
                        </Button>
                        <Button type="button" onClick={() => void applyCrop()} disabled={cropApplying}>
                            {cropApplying ? 'Aplicando…' : 'Aplicar recorte'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
