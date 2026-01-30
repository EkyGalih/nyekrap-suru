export interface DrakorSeries {
  title: string;
  duration: string | null;
  eps: string | null;
  rating: string | null;
  resolution: string | null;
  updated_at: string | null;
  thumbnail?: string | null;
  endpoint: string | null;
}

export interface SeriesResult {
  pagination: number;
  datas: DrakorSeries[];
}

export interface EpisodeResolution {
  resolution: string;
  src: string;
}

export interface EpisodeItem {
  title: string
  episode_id: string
  tag: string
  resolutions: EpisodeResolution[]
}

export interface DrakorRating {
  score: string;
  count: string;
}

export interface DrakorStar {
  name: string;
  link?: string;
}

export interface DrakorDetailInfo {
  [key: string]: string;
}

export interface DrakorDetailResult {
  title: string;
  title_alt: string;
  synopsis: string;
  thumbnail?: string | null;

  genres: string[];

  rating: DrakorRating;

  info: DrakorDetailInfo;

  stars: DrakorStar[];

  total_episode_available: number;
  episodes: EpisodeItem[];

  is_series: boolean;
  is_movie: boolean;
}

/* ==============================
   PARAM TYPE
============================== */

export interface DetailParams {
  endpoint: string;
}

/* ==============================
   SEARCH PARAM TYPE
============================== */
export interface SearchDramaCard {
  title: string;
  time: string | null;
  resolution: string | null;
  updated_at: string | null;
  eps: string | null;
  rating: string | null;
  thumbnail: string | null;
  endpoint: string | null;
}

export interface SearchDramaResult {
  pagination: number;
  datas: SearchDramaCard[];
}

/* ==============================
   MOVIE PARAM TYPE
============================== */
export interface MovieItem {
  title: string;
  year: string | null;
  duration: string | null;
  resolution: string | null;
  updated_at: string | null;
  rating: string | null;
  tag: string | null;
  thumbnail?: string | null;
  endpoint: string;
}

export interface MovieResult {
  pagination: number;
  datas: MovieItem[];
}

/* ===============================
   TYPES LATEST
================================ */

export interface LatestItem {
  title: string;
  year: string | null;
  endpoint: string;
  thumbnail: string | null;

  // Info tambahan
  eps?: string | null;
  duration?: string | null;

  resolution?: string | null;
  updated_at?: string | null;

  rating?: string | null;
}

export interface HomeResult {
  latest_eps: LatestItem[];
  latest_movies: LatestItem[];
  latest_series: LatestItem[];
}

/* ===============================
   ONGOING SERIES TYPES
================================ */

export interface SeriesCard {
  title: string;
  endpoint: string;
  thumbnail: string | null;

  duration: string | null;
  resolution: string | null;
  updated_at: string | null;

  eps: string | null;
  rating: string | null;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface SidebarItem {
  title: string;
  endpoint: string;
  thumbnail: string | null;
  views: string | null;
}

export interface OngoingSeriesResult {
  pagination: number;
  datas: SeriesCard[];

  filters: {
    countries: FilterOption[];
    genres: FilterOption[];
    years: FilterOption[];
    media_types: FilterOption[];
  };

  sidebar: {
    most_viewed: SidebarItem[];
    completed: SidebarItem[];
    genres: string[];
    years: string[];
  };
}

/* ===============================
   SERIES COMPLETED TYPES
================================ */

export interface CompletedSeriesCard {
  title: string;
  endpoint: string;
  thumbnail: string | null;

  duration: string | null;
  resolution: string | null;
  updated_at: string | null;

  eps: string | null;
  rating: string | null;
}

export interface CompletedSeriesResult {
  pagination: number;
  datas: CompletedSeriesCard[];
}

/* ===============================
   GENRES TYPES
================================ */

export interface GenreItem {
  title: string;
}

/* ===============================
   DETAIL GENRES TYPES
================================ */

export interface GenreDetailCard {
  title: string;
  endpoint: string;
  duration: string | null;
  resolution: string | null;
  updated_at: string | null;
  eps: string | null;
  rating: string | null;
  thumbnail: string | null;
}

export interface GenreDetailResult {
  pagination: number;
  datas: GenreDetailCard[];
}
