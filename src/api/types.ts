// ==========================================
// Common & Enum Types
// ==========================================

export type StoryStatus = 'ONGOING' | 'HIATUS' | 'COMPLETED';

export type ChapterType = 'A' | 'B';

export type ApiErrorCode =
  | 'INVALID_LIMIT'
  | 'INVALID_CURSOR'
  | 'MISSING_PARAMETER'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'INTERNAL';

// ==========================================
// Error Envelopes
// ==========================================

export interface ErrorDetail {
  code: ApiErrorCode;
  message: string;
}

export interface ErrorResponse {
  error: ErrorDetail;
}

// ==========================================
// Story Models (Feed & Details)
// ==========================================

export interface StorySummary {
  storyId: string;
  thumbnailUrl: string;
  title: string;
  views: string;
  creators: string[];
  tags: string[];
  lastUpdated: string;
  chapterCount: number;
}

/**
 * Return type for getStoryDetail(storyId) -> GET /stories/{storyId}
 */
export interface StoryDetail extends StorySummary {
  description: string;
  status: StoryStatus;
}

/**
 * Return type for getStories(limit, cursor) -> GET /stories
 */
export interface StoryList {
  page: StorySummary[];
  hasMore: boolean;
  continueCursor: string | null;
}

// ==========================================
// Chapter Models (Chapter List & Reader)
// ==========================================

export interface ChapterSummary {
  chapterId: string;
  chapterNum: number;
  thumbnailUrl: string;
  description: string;
  views: string;
  type: ChapterType;
  pageCount: number;
}

/**
 * Return type for getChapters(storyId, limit, cursor) -> GET /chapters?story={storyId}
 */
export interface ChapterList {
  page: ChapterSummary[];
  hasMore: boolean;
  continueCursor: string | null;
}

export interface ComicPage {
  pageNum: number;
  pageUrl: string;
  altText: string;
  resolution: [width: number, height: number];
}

export interface CreatorNote {
  creator: string;
  note: string;
}

/**
 * Return type for getChapterDetail(chapterId) -> GET /chapters/{chapterId}
 */
export interface ChapterDetail {
  chapterNum: number;
  chapterPages: ComicPage[];
  creatorsNotes: CreatorNote[];
  views: string;
}

// ==========================================
// Request Parameter Interfaces
// ==========================================

export interface GetStoriesParams {
  limit?: number; // default: 10, max: 50
  cursor?: string;
}

export interface GetStoryDetailParams {
  storyId: string;
}

export interface GetChaptersParams {
  story: string; // storyId
  limit?: number; // default: 10, max: 50
  cursor?: string;
}

export interface GetChapterDetailParams {
  chapterId: string;
}

export interface HealthStatus {
  status: string;
}
