export const removeDomain = (url: string) => {
  const path = url.trim().replace(/^https?:\/\/[^\/]+/, "");

  return path.startsWith("/") ? path : `/${path}`;
};
