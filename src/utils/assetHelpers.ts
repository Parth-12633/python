export function publicAsset(path: string) {
  const baseUrl = import.meta.env.BASE_URL ?? '/';
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
