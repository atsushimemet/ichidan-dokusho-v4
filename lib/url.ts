export function getSiteUrl() {
  if (typeof window !== 'undefined') {
    const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
    return envSiteUrl && envSiteUrl.length > 0 ? envSiteUrl : window.location.origin
  }

  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}
