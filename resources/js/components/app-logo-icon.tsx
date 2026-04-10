import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/** Ruta pública del logo institucional (copiado a `public/images/brand-logo.png`). */
export const BRAND_LOGO_SRC = '/images/brand-logo.png';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
    alt?: string;
};

export default function AppLogoIcon({ className, alt = '', ...props }: Props) {
    return (
        <img
            src={BRAND_LOGO_SRC}
            alt={alt}
            decoding="async"
            className={cn('object-contain', className)}
            {...props}
        />
    );
}
