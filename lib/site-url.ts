const DEFAULT_SITE_URL = "https://uploadthingui.webdevkaleem.com";

export function getSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    DEFAULT_SITE_URL;

  return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
}
