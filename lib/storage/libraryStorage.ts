export interface ArticleData {
  slug: string;
  title: string;
  excerpt?: string;
  content?: any[];
  coverImageUrl?: string | null;
  readingTime?: number;
  authorName?: string;
  publishDate?: string;
  category?: string;
}

const STORAGE_KEYS = {
  BOOKMARKS: "theaskt_bookmarks",
  DOWNLOADS: "theaskt_downloads",
  HISTORY: "theaskt_history",
};

export function getBookmarks(): ArticleData[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || "[]");
  } catch {
    return [];
  }
}

export function toggleBookmark(article: ArticleData): boolean {
  const list = getBookmarks();
  const index = list.findIndex((a) => a.slug === article.slug);
  if (index > -1) {
    list.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
    return false; // unbookmarked
  } else {
    // Save metadata
    list.unshift({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      coverImageUrl: article.coverImageUrl,
      readingTime: article.readingTime,
      authorName: article.authorName,
      publishDate: article.publishDate,
      category: article.category,
    });
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
    return true; // bookmarked
  }
}

export function isBookmarked(slug: string): boolean {
  return getBookmarks().some((a) => a.slug === slug);
}

export function getDownloads(): ArticleData[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DOWNLOADS) || "[]");
  } catch {
    return [];
  }
}

export function toggleDownload(article: ArticleData): boolean {
  const list = getDownloads();
  const index = list.findIndex((a) => a.slug === article.slug);
  if (index > -1) {
    list.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(list));
    return false; // deleted
  } else {
    // Save metadata and content blocks for offline reading
    list.unshift({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      coverImageUrl: article.coverImageUrl,
      readingTime: article.readingTime,
      authorName: article.authorName,
      publishDate: article.publishDate,
      category: article.category,
    });
    localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(list));
    return true; // downloaded
  }
}

export function isDownloaded(slug: string): boolean {
  return getDownloads().some((a) => a.slug === slug);
}

export function addToHistory(article: ArticleData) {
  if (typeof window === "undefined") return;
  try {
    const list: ArticleData[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
    const filtered = list.filter((a) => a.slug !== article.slug);
    filtered.unshift({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      coverImageUrl: article.coverImageUrl,
      readingTime: article.readingTime,
      authorName: article.authorName,
      publishDate: article.publishDate,
      category: article.category,
    });
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered.slice(0, 30)));
  } catch (e) {
    console.error("Error updating history storage:", e);
  }
}

export function getHistory(): ArticleData[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
  } catch {
    return [];
  }
}
