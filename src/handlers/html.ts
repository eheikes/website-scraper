import { Handler } from '../types.js'
import { sameDomainAs, toAbsoluteUrl } from '../util.js'

export const handle: Handler = async (request, body, parseWithCheerio) => {
  const parsedUrl = new URL(request.url)
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
  const styles = $('[style*="url("]')
    .map((_, el) => $(el).attr('style'))
    .get()
    .map((attr) => attr.replace(/^.*url\(['"]?(.*?)['"]?\).*$/, '$1'))
  const ogUrls = $('meta[property="og:url"]')
    .map((_, el) => $(el).attr('content'))
    .get()
  const ogImages = $('meta[property="og:image"]')
    .map((_, el) => $(el).attr('content'))
    .get()
  const urls = [
    ...links,
    ...metaLinks,
    ...scripts,
    ...images,
    ...forms,
    ...styles,
    ...ogUrls,
    ...ogImages
  ]
  const filteredUrls = urls.map(toAbsoluteUrl(parsedUrl.origin)).filter(sameDomainAs(parsedUrl.hostname))
  return {
    links: filteredUrls,
    data: {
      type: 'text',
      content: body.toString()
    }
  }
}
