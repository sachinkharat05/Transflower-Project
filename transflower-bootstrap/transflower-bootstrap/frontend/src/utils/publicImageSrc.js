/**
 * Builds a browser URL for catalog images shipped from `public/image` or absolute URLs from the API.
 */
export function publicImageSrc(imagePathOrUrl) {
  if (!imagePathOrUrl) return '';
  const s = String(imagePathOrUrl);
  if (/^https?:\/\//i.test(s)) return s;
  const stripped = s.replace(/^\.\//, '');
  return `/${stripped.replace(/^\/+/, '')}`;
}
