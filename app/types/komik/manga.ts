export type KomikuHotItem = {
    title: string
    thumbnail: string | null
    newest_chapter: string | null
    viewers: number | null
    endpoint: string
    type: string | null
}

export interface KomikUpdatedItem {
    title: string
    thumbnail: string | null
    endpoint: string
    type: string
    newest_chapter: string
    views: string | null
    updated_at: string | null
}

export interface KomikuChapter {
    title: string
    endpoint: string
    views: number
    release_date: string
}

export interface KomikuDetail {
    endpoint: string
    title: string
    title_indonesia: string | null
    thumbnail: string | null
    description: string
    info: Record<string, string>
    genres: string[]
    total_chapter: number
    chapters: KomikuChapter[]
}

export interface ChapterResult {
    endpoint: string
    title: string | null
    title_comic: string | null
    chapter_number: string | null
    total_images: number
    total_pages: string | number
    images: string[]
    next_chapter: string | null
    prev_chapter: string | null
}

export interface MangaItem {
    title: string
    endpoint: string
    thumbnail: string | null
    type: string | null
    genre: string | null
    status: string | null
}

export interface DaftarResult {
    pagination: {
        currentPage: number
        totalPages: number
    }
    datas: MangaItem[]
}

export interface KomikuSearchItem {
    title: string
    endpoint: string
    thumbnail: string | null
    type: string | null
    genre: string | null
    updated: string | null
    first_chapter: string | null
    latest_chapter: string | null
}

export interface KomikuSearchResult {
    pagination: number
    datas: KomikuSearchItem[]
}

export interface KomikuGenre {
    title: string
    endpoint: string
}

export interface GenreItem {
    title: string
    endpoint: string | null
    thumbnail: string | null
    type: string | null
    genre: string | null
    views_info: string
    description: string
    first_chapter: {
        title: string
        endpoint: string | null
    }
    latest_chapter: {
        title: string
        endpoint: string | null
    }
}

export interface GenreResult {
    total: number
    next_page: string | null
    datas: GenreItem[]
}