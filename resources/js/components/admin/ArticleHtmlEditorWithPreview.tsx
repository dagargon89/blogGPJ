import DOMPurify from 'dompurify';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Code2,
    Eye,
    Heading2,
    Heading3,
    Heading4,
    Image,
    Italic,
    Link,
    Link2Off,
    List,
    ListOrdered,
    Minus,
    Pilcrow,
    Quote,
    Redo2,
    Strikethrough,
    Table,
    Underline,
    Undo2,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import {
    Table as TableExtension,
    TableRow as TableRowExtension,
    TableHeader as TableHeaderExtension,
    TableCell as TableCellExtension,
} from '@tiptap/extension-table';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlignExtension from '@tiptap/extension-text-align';
import PlaceholderExtension from '@tiptap/extension-placeholder';
import InputError from '@/components/input-error';
import { ARTICLE_PROSE_CLASSNAME } from '@/components/renderers/ArticleRenderer';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/* ── Sanitizer config (shared with preview) ─────────────────────── */
const ALLOWED_TAGS = [
    'a', 'article', 'b', 'blockquote', 'br', 'code', 'div', 'em',
    'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'header', 'hr', 'i', 'img', 'li', 'main', 'nav', 'ol', 'p', 'pre',
    'section', 'span', 'strong', 'table', 'tbody', 'td', 'th', 'thead',
    'tr', 'u', 'ul',
];
const ALLOWED_ATTR = [
    'alt', 'class', 'colspan', 'href', 'id', 'rel', 'rowspan', 'src',
    'target', 'title', 'style',
];

/* ── Props ───────────────────────────────────────────────────────── */
export interface ArticleHtmlEditorWithPreviewProps {
    id: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    rows?: number;
}

/* ── Small toolbar button ─────────────────────────────────────────── */
function ToolBtn({
    tip,
    active,
    disabled,
    onClick,
    children,
}: {
    tip: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onClick();
                    }}
                    disabled={disabled}
                    className={cn(
                        'flex size-7 items-center justify-center rounded transition-colors',
                        active
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        disabled && 'cursor-not-allowed opacity-40',
                    )}
                    aria-label={tip}
                >
                    {children}
                </button>
            </TooltipTrigger>
            <TooltipContent>{tip}</TooltipContent>
        </Tooltip>
    );
}

/* ── Divider between toolbar groups ─────────────────────────────── */
function Divider() {
    return (
        <span className="mx-0.5 h-5 w-px shrink-0 bg-border" aria-hidden />
    );
}

/* ── Main component ──────────────────────────────────────────────── */
export function ArticleHtmlEditorWithPreview({
    id,
    label = 'Contenido',
    value,
    onChange,
    error,
    placeholder = '<p>Escribe el contenido aquí…</p>',
}: ArticleHtmlEditorWithPreviewProps) {
    const [mode, setMode] = useState<'visual' | 'html'>('visual');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [imageAlt, setImageAlt] = useState('');

    /* Track last known value to avoid update loops */
    const lastValueRef = useRef(value);

    /* ── TipTap editor ─────────────────────────────────────────────── */
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: { HTMLAttributes: { class: 'not-prose' } } }),
            UnderlineExtension,
            LinkExtension.configure({ openOnClick: false, autolink: true }),
            ImageExtension.configure({ inline: false }),
            TableExtension.configure({ resizable: false }),
            TableRowExtension,
            TableHeaderExtension,
            TableCellExtension,
            TextAlignExtension.configure({ types: ['heading', 'paragraph'] }),
            PlaceholderExtension.configure({ placeholder }),
        ],
        content: value || '',
        onUpdate({ editor }) {
            const html = editor.getHTML();
            lastValueRef.current = html;
            onChange(html);
        },
        editorProps: {
            attributes: {
                id,
                class: 'article-body tiptap-editor focus:outline-none min-h-64 p-4',
            },
        },
    });

    /* Sync external value → TipTap (e.g. form reset) */
    useEffect(() => {
        if (!editor || mode !== 'visual') return;
        if (value !== lastValueRef.current) {
            lastValueRef.current = value;
            editor.commands.setContent(value || '', false);
        }
    }, [value, editor, mode]);

    /* ── Mode toggle ─────────────────────────────────────────────── */
    const switchToHtml = useCallback(() => {
        if (!editor) return;
        setMode('html');
    }, [editor]);

    const switchToVisual = useCallback(() => {
        if (!editor) return;
        editor.commands.setContent(value || '', false);
        lastValueRef.current = value;
        setMode('visual');
    }, [editor, value]);

    /* ── Link helpers ─────────────────────────────────────────────── */
    const openLinkDialog = useCallback(() => {
        const existing = editor?.getAttributes('link').href ?? '';
        setLinkUrl(existing);
        setLinkDialogOpen(true);
    }, [editor]);

    const applyLink = useCallback(() => {
        if (!editor) return;
        if (!linkUrl.trim()) {
            editor.chain().focus().unsetLink().run();
        } else {
            editor.chain().focus().setLink({ href: linkUrl.trim() }).run();
        }
        setLinkDialogOpen(false);
        setLinkUrl('');
    }, [editor, linkUrl]);

    /* ── Image helpers ────────────────────────────────────────────── */
    const applyImage = useCallback(() => {
        if (!editor || !imageSrc.trim()) return;
        editor.chain().focus().setImage({ src: imageSrc.trim(), alt: imageAlt.trim() }).run();
        setImageDialogOpen(false);
        setImageSrc('');
        setImageAlt('');
    }, [editor, imageSrc, imageAlt]);

    /* ── Sanitized preview HTML ───────────────────────────────────── */
    const safeHtml = DOMPurify.sanitize(value?.trim() ?? '', {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
    });

    if (!editor) return null;

    /* ── Toolbar ─────────────────────────────────────────────────── */
    const toolbar = (
        <TooltipProvider>
            <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 px-2 py-1.5">
                {/* History */}
                <ToolBtn tip="Deshacer (Ctrl+Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
                    <Undo2 className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Rehacer (Ctrl+Y)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
                    <Redo2 className="size-3.5" />
                </ToolBtn>

                <Divider />

                {/* Headings */}
                <ToolBtn tip="Párrafo" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>
                    <Pilcrow className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Encabezado 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                    <Heading2 className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Encabezado 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                    <Heading3 className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Encabezado 4" active={editor.isActive('heading', { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
                    <Heading4 className="size-3.5" />
                </ToolBtn>

                <Divider />

                {/* Inline formats */}
                <ToolBtn tip="Negrita (Ctrl+B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                    <Bold className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Cursiva (Ctrl+I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Subrayado (Ctrl+U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                    <Underline className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Tachado" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
                    <Strikethrough className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Código en línea" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
                    <Code className="size-3.5" />
                </ToolBtn>

                <Divider />

                {/* Alignment */}
                <ToolBtn tip="Alinear a la izquierda" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                    <AlignLeft className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Centrar" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                    <AlignCenter className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Alinear a la derecha" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                    <AlignRight className="size-3.5" />
                </ToolBtn>

                <Divider />

                {/* Blocks */}
                <ToolBtn tip="Lista con viñetas" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <List className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Lista numerada" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Cita" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                    <Quote className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Bloque de código" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                    <Code2 className="size-3.5" />
                </ToolBtn>
                <ToolBtn tip="Línea horizontal" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    <Minus className="size-3.5" />
                </ToolBtn>

                <Divider />

                {/* Insert */}
                <ToolBtn
                    tip={editor.isActive('link') ? 'Editar enlace' : 'Insertar enlace'}
                    active={editor.isActive('link')}
                    onClick={openLinkDialog}
                >
                    <Link className="size-3.5" />
                </ToolBtn>
                {editor.isActive('link') && (
                    <ToolBtn tip="Quitar enlace" onClick={() => editor.chain().focus().unsetLink().run()}>
                        <Link2Off className="size-3.5" />
                    </ToolBtn>
                )}
                <ToolBtn tip="Insertar imagen" onClick={() => setImageDialogOpen(true)}>
                    <Image className="size-3.5" />
                </ToolBtn>
                <ToolBtn
                    tip="Insertar tabla (3×3)"
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                >
                    <Table className="size-3.5" />
                </ToolBtn>

                {/* Spacer */}
                <span className="flex-1" />

                {/* View controls */}
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1.5 px-2 text-xs"
                    onClick={() => setPreviewOpen(true)}
                >
                    <Eye className="size-3.5" />
                    Vista previa
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={mode === 'html' ? 'default' : 'outline'}
                    className="h-7 gap-1.5 px-2 text-xs"
                    onClick={mode === 'visual' ? switchToHtml : switchToVisual}
                >
                    <Code2 className="size-3.5" />
                    {mode === 'visual' ? 'HTML' : 'Visual'}
                </Button>
            </div>
        </TooltipProvider>
    );

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>

            <div className="overflow-hidden rounded-lg border border-border shadow-sm">
                {toolbar}

                {/* Visual editor */}
                {mode === 'visual' && (
                    <EditorContent editor={editor} />
                )}

                {/* HTML source */}
                {mode === 'html' && (
                    <textarea
                        value={value}
                        onChange={(e) => {
                            lastValueRef.current = e.target.value;
                            onChange(e.target.value);
                        }}
                        className="min-h-64 w-full resize-y bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        placeholder="<p>Escribe HTML aquí…</p>"
                        spellCheck={false}
                    />
                )}
            </div>

            <InputError message={error} />

            {/* ── Link dialog ───────────────────────────────────── */}
            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Insertar enlace</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="link-url">URL</Label>
                            <Input
                                id="link-url"
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://ejemplo.com"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && applyLink()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={applyLink}>Aplicar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Image dialog ─────────────────────────────────── */}
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Insertar imagen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="img-src">URL de la imagen</Label>
                            <Input
                                id="img-src"
                                type="url"
                                value={imageSrc}
                                onChange={(e) => setImageSrc(e.target.value)}
                                placeholder="https://…/imagen.jpg"
                                autoFocus
                            />
                        </div>
                        <div>
                            <Label htmlFor="img-alt">Texto alternativo</Label>
                            <Input
                                id="img-alt"
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                                placeholder="Descripción de la imagen"
                                onKeyDown={(e) => e.key === 'Enter' && applyImage()}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={applyImage} disabled={!imageSrc.trim()}>
                            Insertar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Preview dialog ───────────────────────────────── */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="flex max-h-[85vh] w-full max-w-3xl flex-col">
                    <DialogHeader className="shrink-0">
                        <DialogTitle>Vista previa</DialogTitle>
                    </DialogHeader>
                    <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-border bg-background p-6">
                        {safeHtml ? (
                            <div
                                className={ARTICLE_PROSE_CLASSNAME}
                                dangerouslySetInnerHTML={{ __html: safeHtml }}
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No hay contenido para previsualizar.
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
