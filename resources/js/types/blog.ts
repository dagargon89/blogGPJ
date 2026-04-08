export type ContentType = 'article' | 'video' | 'infographic' | 'document';

export type PostStatus = 'draft' | 'published' | 'archived';

export type CategoryRef = {
    name: string;
    slug: string;
};

export type TagRef = {
    name: string;
    slug: string;
};

export type PostCard = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content_type: ContentType;
    cover: string | null;
    author: string | null;
    category: CategoryRef | null;
    published_at: string | null;
};

export type PostDetail = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string | null;
    content_type: ContentType;
    media: {
        cover: string | null;
        youtube_id: string | null;
        document: string | null;
    };
    author: string | null;
    category: CategoryRef | null;
    tags: TagRef[];
    published_at: string | null;
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    posts_count?: number;
};

export type Tag = {
    id: number;
    name: string;
    slug: string;
    posts_count?: number;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};
