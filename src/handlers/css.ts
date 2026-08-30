import { Handler } from '../types.js'
import { normalizeUrl, sameDomainAs } from '../util.js'

export const handle: Handler = async (request, body) => {
  const baseUrl = request.loadedUrl || request.url
  const parsedUrl = new URL(baseUrl)
  const isSameDomain = sameDomainAs(parsedUrl.hostname)

  const matches = body.toString().matchAll(/\burl\(['"]?(.*?)['"]?\)/g)
  const urls: string[] = []
  for (const match of matches) {
    const rawUrl = match[1]
    const normalized = normalizeUrl(rawUrl, baseUrl)
    if (normalized && isSameDomain(normalized)) {
      urls.push(normalized)
    }
  }

  return {
    links: Array.from(new Set(urls)),
    data: {
      type: 'text',
      content: body.toString()
    }
  }
}

