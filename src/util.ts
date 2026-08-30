export const normalizeUrl = (rawUrl: string | undefined | null, baseUrl: string): string | null => {
  if (!rawUrl || typeof rawUrl !== 'string') return null
  const trimmed = rawUrl.trim()
  if (!trimmed) return null

  // Filter out non-http(s) schemes like mailto:, javascript:, tel:, data:
  if (/^(mailto:|javascript:|tel:|data:|blob:|sms:|callto:)/i.test(trimmed)) {
    return null
  }

  try {
    const parsed = new URL(trimmed, baseUrl)
    // Only accept http: and https: protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null
    }
    // Strip hash fragments so identical pages with anchor tags are not crawled multiple times
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return null
  }
}

export const toAbsoluteUrl = (origin: string) => (url: string): string => {
  const normalized = normalizeUrl(url, origin)
  return normalized ?? ''
}

export const sameDomainAs = (domainToMatch: string) => (url: string): boolean => {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname.toLowerCase() === domainToMatch.toLowerCase()
  } catch {
    return false
  }
}

