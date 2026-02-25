import {useState} from 'react';
import {fetchTopHeadlines, searchArticles} from '../api/newsApi';
import {NewsArticle} from '../types/news';

const clampMax = (raw: string): number => {
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    return 10;
  }
  return Math.min(Math.max(Math.floor(parsed), 1),10);
};

export function useNews() {
  const [query, setQuery] = useState('');
  const [findQuery, setFindQuery] = useState('');
  const [maxResults, setMaxResults] = useState('10');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const matchesTerm = (article: NewsArticle, term: string): boolean => {
    const needle = term.toLowerCase();
    const title = article.title?.toLowerCase() ?? '';
    const source = article.source?.name?.toLowerCase() ?? '';
    const description = article.description?.toLowerCase() ?? '';
    const content = article.content?.toLowerCase() ?? '';

    return (
      title.includes(needle) ||
      source.includes(needle) ||
      description.includes(needle) ||
      content.includes(needle)
    );
  };

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

  const queryByKeyword = async (keyword: string): Promise<NewsArticle[]> => {
    const response = await searchArticles(keyword, {
      max: clampMax(maxResults),
      lang: 'en',
      inFields: 'title,description,content',
    });
    return response.articles;
  };

  const queryByTitleOrAuthor = async (titleOrAuthor: string): Promise<NewsArticle[]> => {
    const response = await searchArticles(titleOrAuthor, {
      max: clampMax(maxResults),
      lang: 'en',
      inFields: 'title,description,content',
    });

    return response.articles.filter(item => matchesTerm(item, titleOrAuthor));
  };

  const runBestSearch = async () => {
    const keyword = query.trim();
    const titleOrAuthor = findQuery.trim();

    await runRequest(async () => {
      if (!keyword && !titleOrAuthor) {
        const response = await fetchTopHeadlines({
          max: clampMax(maxResults),
          lang: 'en',
          country: 'us',
        });
        return response.articles;
      }

      if (keyword && titleOrAuthor) {
        const keywordResults = await queryByKeyword(keyword);
        return keywordResults.filter(item => matchesTerm(item, titleOrAuthor));
      }

      if (keyword) {
        return queryByKeyword(keyword);
      }

      return queryByTitleOrAuthor(titleOrAuthor);
    });
  };

  return {
    query,
    setQuery,
    findQuery,
    setFindQuery,
    maxResults,
    setMaxResults,
    loading,
    error,
    loadedCount: articles.length,
    articles,
    loadTopHeadlines,
    runBestSearch,
  };
}