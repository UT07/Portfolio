const DEFAULT_ASSET_BASE = 'https://d1q048o59d0tgk.cloudfront.net/assets';
export const ASSET_BASE = (process.env.REACT_APP_ASSET_BASE_URL || DEFAULT_ASSET_BASE).replace(/\/$/, '');

const isAbsoluteUrl = (value) => /^([a-z][a-z0-9+.-]*:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:');

export const normalizeAssetPath = (path) => {
  if (!path) return path;
  let cleaned = path.trim().replace(/\\/g, '/');
  if (isAbsoluteUrl(cleaned)) return cleaned;
  cleaned = cleaned.replace(/^\/+(?=assets\/)/, '/');
  cleaned = cleaned.replace(/^\/?assets\//, '/');
  cleaned = cleaned.replace(/\/assets\//g, '/');
  cleaned = cleaned.replace(/\/{2,}/g, '/');
  return cleaned;
};

export const assetUrl = (pathOrUrl) => {
  if (!pathOrUrl) return pathOrUrl;
  if (isAbsoluteUrl(pathOrUrl)) return pathOrUrl;
  const normalized = normalizeAssetPath(pathOrUrl);
  if (normalized.startsWith('/')) return `${ASSET_BASE}${normalized}`;
  return `${ASSET_BASE}/${normalized}`;
};
