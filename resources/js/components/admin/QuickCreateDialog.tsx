import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Option {
    id: number;
    name: string;
}

interface Props {
    label: string;
    endpoint: string;
    onCreated: (item: Option) => void;
}

export function QuickCreateTrigger({ label, endpoint, onCreated }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label={`Crear nueva ${label.toLowerCase()}`}
            >
                <PlusIcon className="size-3" />
            </button>

            <QuickCreateDialog
                open={open}
                onOpenChange={setOpen}
                label={label}
                endpoint={endpoint}
                onCreated={onCreated}
            />
        </>
    );
}

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    label: string;
    endpoint: string;
    onCreated: (item: Option) => void;
}

function QuickCreateDialog({
    open,
    onOpenChange,
    label,
    endpoint,
    onCreated,
}: DialogProps) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const reset = () => {
        setName('');
        setError('');
    };

    const handleOpenChange = (value: boolean) => {
        if (!value) {
            reset();
        }
        onOpenChange(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmed = name.trim();
        if (!trimmed) {
            return;
        }

        setSaving(true);
        setError('');

        try {
            const token =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') ?? '';

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify({ name: trimmed }),
            });

            const json = await res.json();

            if (!res.ok) {
                setError(json.errors?.name?.[0] ?? 'Error al crear');
                return;
            }

            onCreated(json as Option);
            reset();
            onOpenChange(false);
        } catch {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Nueva {label.toLowerCase()}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="quick-create-name">Nombre</Label>
                        <Input
                            id="quick-create-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                            placeholder={`Nombre de la ${label.toLowerCase()}`}
                        />
                        {error && (
                            <p className="mt-1 text-sm text-destructive">
                                {error}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving || !name.trim()}
                        >
                            {saving ? 'Guardando…' : 'Crear'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
