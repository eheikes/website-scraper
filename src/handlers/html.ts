import { Handler } from '../types.js'
import { normalizeUrl, sameDomainAs } from '../util.js'

export const handle: Handler = async (request, body, parseWithCheerio) => {
  const baseUrl = request.loadedUrl ?? request.url
  const parsedUrl = new URL(baseUrl)
  const isSameDomain = sameDomainAs(parsedUrl.hostname)

  const $ = await parseWithCheerio()

  const links = $('a[href]')
    .map((_, el) => $(el).attr('href'))
    .get()
  const metaLinks = $('link[href]')
    .map((_, el) => $(el).attr('href'))
    .get()
  const scripts = $('script[src]')
    .map((_, el) => $(el).attr('src'))
    .get()
  const images = $('img[src]')
    .map((_, el) => $(el).attr('src'))
    .get()
  const forms = $('form[action]')
    .map((_, el) => $(el).attr('action'))
    .get()

  const styleUrls: string[] = []
  $('[style*="url("]').each((_, el) => {
    const styleAttr = $(el).attr('style') ?? ''
    const matches = styleAttr.matchAll(/\burl\(['"]?(.*?)['"]?\)/g)
    for (const match of matches) {
      if (match[1] !== '') {
        styleUrls.push(match[1])
      }
    }
  })

  const ogUrls = $('meta[property="og:url"], meta[name="twitter:url"]')
    .map((_, el) => $(el).attr('content'))
    .get()
  const ogImages = $('meta[property="og:image"], meta[name="twitter:image"]')
    .map((_, el) => $(el).attr('content'))
    .get()

  const rawUrls = [
    ...links,
    ...metaLinks,
    ...scripts,
    ...images,
    ...forms,
    ...styleUrls,
    ...ogUrls,
    ...ogImages
  ]

  const validUrls: string[] = []
  for (const rawUrl of rawUrls) {
    const normalized = normalizeUrl(rawUrl, baseUrl)
    if (normalized !== null && isSameDomain(normalized)) {
      validUrls.push(normalized)
    }
  }

  return {
    links: Array.from(new Set(validUrls)),
    data: {
      type: 'text',
      content: body.toString()
    }
  }
}
