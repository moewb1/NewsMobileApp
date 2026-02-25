import {apiClient} from './client';
import {ENV} from '../config/env';
import {NewsResponse} from '../types/news';

type QueryOptions = {
  lang?: string;
  country?: string;
  max?: number;
  page?: number;
  inFields?: string;
};

const normalizeMax = (value = 10): number => {
  if (!Number.isFinite(value)) {
    return 10;
  }
  return Math.min(Math.max(Math.floor(value), 1), 10);
};

const ensureApiKey = () => {
  if (!ENV.GNEWS_API_KEY){
    throw new Error('Missing GNEWS_API_KEY. Create a .env file from .env.example');
  }
}

export async function fetchTopHeadlines(
  options: QueryOptions = {},
): Promise<NewsResponse> {
  ensureApiKey();
  const {data} = await apiClient.get<NewsResponse>('/top-headlines', {
    params: {
      lang: options.lang ?? 'en',
      country: options.country ?? 'us',
      max: normalizeMax(options.max),
      page: options.page ?? 1,
      apikey: ENV.GNEWS_API_KEY,
    }
  })
  return data;
}

export async function searchArticles(
  query: string,
  options: QueryOptions = {},
): Promise<NewsResponse> {
  ensureApiKey();
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return {totalArticles: 0, articles: []};
  }

  const {data} = await apiClient.get<NewsResponse>('/search', {
    params: {
      q: cleanQuery,
      lang: options.lang ?? 'en',
      max: normalizeMax(options.max),
      page: options.page ?? 1,
      ...(options.inFields ? {in: options.inFields} : {}),
      apikey: ENV.GNEWS_API_KEY,
    },
  });

  return data;
}