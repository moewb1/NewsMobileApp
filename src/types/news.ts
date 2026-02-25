export type NewsSource  = {
  name: string;
  url: string;
};

export type NewsArticle = {
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  image: string | null;
  publishedAt: string;
  source: NewsSource;
};

export type NewsResponse = {
  totalArticles: number;
  articles: NewsArticle[];
}