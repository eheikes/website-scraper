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
  ['text/css', handleCss],
  ['text/html', handleHtml],
  ['text/plain', handlePlainText],
  ['text/xml', handlePlainText]
])

export const router = createHttpRouter()

router.addDefaultHandler(async (context) => {
    const { request, response, log, crawler, body, parseWithCheerio, pushData } = context

    const parsedContentType = parse(String(response.headers['content-type']))
    const contentType = parsedContentType.type

    log.info(`enqueueing new URL`, { url: request.url, contentType })

    const handler = handlers.get(contentType)
    if (handler) {
      const handledContent = await handler(request, body, parseWithCheerio)
      await crawler.addRequests(handledContent.links)
      await pushData({
        ...handledContent.data,
        url: request.loadedUrl || request.url,
        headers: response.headers,
        mimeType: contentType,
        size: body.length
      })
    } else {
      throw new Error(`No handler for content-type of "${contentType}"`)
    }
})
