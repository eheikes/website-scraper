import { dirname, resolve } from 'path'
import { Handler } from '../types.js'
import { sameDomainAs, toAbsoluteUrl } from '../util.js'

export const handle: Handler = async (request, body) => {
  const parsedUrl = new URL(request.url)

  const matches = body.toString().matchAll(/\burl\(['"]?(.*?)['"]?\)/g)
  let urls = []
  for (const match of matches) {
    const url = match[1]
    if (url.startsWith('data:')) { continue }
    const basePath = dirname(parsedUrl.pathname) // CSS URLs are relative to the file they are defined in
    const absoluteUrl = toAbsoluteUrl(parsedUrl.origin)(resolve(basePath, url))
    if (!sameDomainAs(parsedUrl.hostname)(absoluteUrl)) { continue }
    urls.push(absoluteUrl)
  }

  return {
    links: urls,
    data: {
      type: 'text',
      content: body.toString()
    }
  }
}
