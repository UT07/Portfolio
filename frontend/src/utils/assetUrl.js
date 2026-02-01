const ASSET_BASE_URL = (process.env.REACT_APP_ASSET_BASE_URL || '').replace(/\/$/, '');

const isAbsoluteUrl = (url) =>
  /^([a-z][a-z0-9+.-]*:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:');

export const resolveAssetUrl = (url) => {
  if (!url) return url;
  if (isAbsoluteUrl(url)) return url;
  if (!ASSET_BASE_URL) return url;
  if (url.startsWith(ASSET_BASE_URL)) return url;
  if (url.startsWith('/')) return `${ASSET_BASE_URL}${url}`;
  return `${ASSET_BASE_URL}/${url}`;
};
