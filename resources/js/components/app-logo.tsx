import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage<{ name: string }>().props;

    return (
        <>
            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md">
                <AppLogoIcon alt="" className="size-8" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">{name}</span>
            </div>
        </>
    );
}
