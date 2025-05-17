// This file contains links used in the web

export const collPage = (slug: string): string => {
  return `/c/${slug}`;
};

export const collCreate = (): string => {
  return `/collections/create`;
};

export const producerPage = (slug: string): string => {
  return `/p/${slug}`;
};
