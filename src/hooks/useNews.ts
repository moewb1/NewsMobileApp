import {useMemo, useState} from 'react';
import {fetchTopHeadlines, searchArticles} from '../api/newsApi';
import {NewsArticle} from '../types/news';

const clampMax = (raw: string): number => {
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    return 10;
  }
  return Math.min(Math.max(Math.floor(parsed), 1), 50);
};

export function useNews() {
  const [query, setQuery] = useState('');
  const [finder, setFinder] = useState('');
  const [maxResults, setMaxResults] = useState('10');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runRequest = async (executor: () => Promise<NewsArticle[]>) => {
    setLoading(true);
    setError('');
    try {
      const nextArticles = await executor();
      setArticles(nextArticles);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Unexpected error while loading news.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadTopHeadlines = async () => {
    await runRequest(async () => {
      const response = await fetchTopHeadlines({
        max: clampMax(maxResults),
        lang: 'en',
        country: 'us',
      });
      return response.articles;
    });
  };

  const searchByKeyword = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('Enter keywords before searching.');
      return;
    }

    await runRequest(async () => {
      const response = await searchArticles(trimmedQuery, {
        max: clampMax(maxResults),
        lang: 'en',
      });
      return response.articles;
    });
  };

  const visibleArticles = useMemo(() => {
    const term = finder.trim().toLowerCase();
    if (!term) {
      return articles;
    }

    return articles.filter(item => {
      const title = item.title?.toLowerCase() ?? '';
      const authorOrSource = item.source?.name?.toLowerCase() ?? '';
      return title.includes(term) || authorOrSource.includes(term);
    });
  }, [articles, finder]);

  return {
    query,
    setQuery,
    finder,
    setFinder,
    maxResults,
    setMaxResults,
    loading,
    error,
    loadedCount: articles.length,
    visibleArticles,
    loadTopHeadlines,
    searchByKeyword,
  };
}