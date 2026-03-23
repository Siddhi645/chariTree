const rawApiBase = import.meta.env.VITE_API_BASE_URL || "";

const normalizedApiBase = rawApiBase.endsWith("/")
  ? rawApiBase.slice(0, -1)
  : rawApiBase;

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedApiBase ? `${normalizedApiBase}${normalizedPath}` : normalizedPath;
}
