export interface AnimeItem {
    title: string;
    episode: string;
    info: string;
    update: string;
    thumbnail: string;
    link: string;
    endpoint: string;
}

export interface OtakudesuHomeResult {
    ongoing: AnimeItem[];
    complete: AnimeItem[];
}

// type detail
export interface GenreItem {
    title: string;
    endpoint: string;
}

export interface EpisodeItem {
    title: string;
    endpoint: string;
}

export interface OtakudesuDetailResult {
    title: string;
    japanese: string;
    thumbnail: string;
    score: string;
    producer: string;
    type: string;
    status: string;
    total_episode: string;
    duration: string;
    release_date: string;
    studio: string;

    synopsis: string;

    genres: GenreItem[];

    first_eps: EpisodeItem;
    latest_eps: EpisodeItem;

    episode_list: EpisodeItem[];
}

// type episode

export interface MirrorItem {
    resolution: string;
    provider: string;
    data: string;
}

export interface DownloadLink {
    provider: string;
    url: string;
}

export interface DownloadItem {
    quality: string;
    size: string;
    links: DownloadLink[];
}

export interface OtakudesuEpisodeResult {
    title: string;
    streaming_iframe: string;
    mirrors: MirrorItem[];
    downloads: DownloadItem[];
}

// genre
export interface AnimeGenreItem {
    title: string;
    endpoint: string;
}

// genre detail
export interface GenreAnimeItem {
    title: string;
    endpoint: string;
    thumbnail: string;
    studio: string;
    eps: string;
    rating: string;
    season: string;
    genres: string[];
}

export interface AnimeGenreDetailResult {
    genre: string;

    current_page: number;
    total_pages: number;

    has_next: boolean;
    has_prev: boolean;

    next_page: number | null;
    prev_page: number | null;

    anime_list: GenreAnimeItem[];
}

// search
export interface SearchAnimeItem {
    title: string;
    endpoint: string;
    thumbnail: string;

    status: string;
    rating: string;

    genres: string[];
}

export interface AnimeSearchResult {
    query: string;
    total_results: number;
    anime_list: SearchAnimeItem[];
}


// anime list
export interface AnimeListItem {
    title: string;
    link: string;
    endpoint: string;
}

export interface OtakudesuAnimeListResult {
    total: number;
    anime_list: AnimeListItem[];
}

// jadwal

export interface AnimeScheduleItem {
    title: string;
    link: string;
    endpoint: string;
}

export interface AnimeScheduleDay {
    day: string;
    anime_list: AnimeScheduleItem[];
}

export interface AnimeScheduleResult {
    total_days: number;
    schedule: AnimeScheduleDay[];
}