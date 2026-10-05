import { Image } from 'react-native';
import { ComicPage } from '../../../api';

// Set of image URLs that have been verified loaded or prefetched in memory/disk cache
export const loadedImageCache = new Set<string>();

export const isPageImageCached = (url: string): boolean => {
  return loadedImageCache.has(url);
};

export const markPageImageCached = (url: string): void => {
  loadedImageCache.add(url);
};

/**
 * Prefetches comic page images in prioritised batches.
 * Priority batch (first 5 pages) loads immediately.
 * Remaining pages load sequentially in the background.
 */
export const prefetchPages = (pages: ComicPage[]) => {
  if (!pages || pages.length === 0) return;

  const urls = pages.map((p) => p.pageUrl).filter(Boolean);

  // 1. Immediately prefetch initial pages
  const immediateBatch = urls.slice(0, 5);
  immediateBatch.forEach((url) => {
    if (!loadedImageCache.has(url)) {
      Image.prefetch(url)
        .then(() => loadedImageCache.add(url))
        .catch(() => {});
    }
  });

  // 2. Prefetch remaining pages progressively
  if (urls.length > 5) {
    const remainingUrls = urls.slice(5);
    const CHUNK_SIZE = 4;

    const prefetchChunk = (startIndex: number) => {
      if (startIndex >= remainingUrls.length) return;
      const chunk = remainingUrls.slice(startIndex, startIndex + CHUNK_SIZE);
      
      Promise.allSettled(
        chunk.map((url) =>
          loadedImageCache.has(url)
            ? Promise.resolve()
            : Image.prefetch(url).then(() => loadedImageCache.add(url))
        )
      ).finally(() => {
        setTimeout(() => prefetchChunk(startIndex + CHUNK_SIZE), 150);
      });
    };

    setTimeout(() => prefetchChunk(0), 200);
  }
};
