const defaultProductionApiBase = "https://charitree-backend.onrender.com";

const rawApiBase =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.VITE_API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? defaultProductionApiBase : "");

const normalizedApiBase = rawApiBase.endsWith("/")
  ? rawApiBase.slice(0, -1)
  : rawApiBase;

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedApiBase ? `${normalizedApiBase}${normalizedPath}` : normalizedPath;
}
