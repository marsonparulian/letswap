// This file contains links used in the web

export const BASE_URL = (): string => {
  return "http://localhost:3000";
};

export const COLL_PAGE = (slug: string): string => {
  return `/c/${slug}`;
};

export const COLL_CREATE = (): string => {
  return `${BASE_URL()}/collections/create`;
};
