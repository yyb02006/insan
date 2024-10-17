export interface FlatformCollection<T, U = T> {
  filmShort: T;
  outsource: U;
}

export interface VideoCollection<T, U = T, G = T> {
  film: T;
  short: U;
  outsource: G;
}

export interface WorkInfosWithId extends WorkInfos {
  id: number;
}

export interface VideoResponseState {
  success: boolean;
  works: { film: WorkInfosWithId[]; short: WorkInfosWithId[]; outsource: WorkInfosWithId[] };
}

export interface WorkInfos {
  title: string;
  description: string;
  resourceId: string;
  category: VideoCategory;
  date: string;
  thumbnailLink: string;
  animatedThumbnailLink: string;
  order: number;
}

export interface VimeoVideos {
  player_embed_url: string;
  resource_key: string;
  pictures: { base_link: string };
  name: string;
  description: string;
  uri: string;
  animated_thumbnail: string;
}

export interface OwnedVideoItems {
  id: number;
  title: string;
  category: VideoCategory;
  date: string;
  description: string;
  resourceId: string;
  order: number;
}

export type ResourceHost = 'vimeo' | 'youtube';

export type FlatformsCategory = 'filmShort' | 'outsource';

export type VideoCategory = 'film' | 'short' | 'outsource';
