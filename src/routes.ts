import { parse } from 'content-type'
import { createHttpRouter } from 'crawlee'
import { Handler } from './types.js'
import { handle as handleBinary } from './handlers/binary.js'
import { handle as handleCss } from './handlers/css.js'
import { handle as handleHtml } from './handlers/html.js'
import { handle as handlePlainText } from './handlers/plain.js'

const handlers = new Map<string, Handler>([
  ['application/javascript', handlePlainText],
  ['application/json', handlePlainText],
  ['application/rss+xml', handlePlainText],
  ['application/xhtml+xml', handleHtml],
  ['application/xml', handlePlainText],
  ['image/gif', handleBinary],
  ['image/jpeg', handleBinary],
  ['image/png', handleBinary],
  ['image/svg+xml', handlePlainText],
  ['image/webp', handleBinary],
  ['image/avif', handleBinary],
  ['image/x-icon', handleBinary],
  ['image/vnd.microsoft.icon', handleBinary],
  ['text/css', handleCss],
  ['text/html', handleHtml],
  ['text/plain', handlePlainText],
  ['text/xml', handlePlainText]
])

export const router = createHttpRouter()

router.addDefaultHandler(async (context) => {
  const { request, response, log, crawler, body, parseWithCheerio, pushData } = context

  let contentType = 'application/octet-stream'
  const rawContentType = response.headers['content-type']
  if (rawContentType) {
    try {
      contentType = parse(String(rawContentType)).type
    } catch {
      contentType = String(rawContentType).split(';')[0].trim().toLowerCase()
    }
  }

  log.info(`Processing URL`, { url: request.url, contentType })

  const handler = handlers.get(contentType)
  if (handler) {
    const handledContent = await handler(request, body, parseWithCheerio)
    if (handledContent.links.length > 0) {
      await crawler.addRequests(handledContent.links)
    }
    await pushData({
      ...handledContent.data,
      url: request.loadedUrl || request.url,
      headers: response.headers,
      mimeType: contentType,
      size: body.length
    })
  } else {
    // Graceful fallback for unhandled MIME types (e.g. PDF, audio, video, web fonts)
    // Avoids throwing errors that trigger unwanted crawler retries
    log.debug(`No specific parser for "${contentType}", saving generic record`, { url: request.url })
    const handledContent = await handleBinary(request, body, parseWithCheerio)
    await pushData({
      ...handledContent.data,
      url: request.loadedUrl || request.url,
      headers: response.headers,
      mimeType: contentType,
      size: body.length
    })
  }
})

