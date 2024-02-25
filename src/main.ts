import { Configuration, HttpCrawler, log } from 'crawlee'
import pick from 'lodash.pick'
import { readFile } from 'fs/promises'
import { router } from './routes.js'

const contextKeys = [
  'minConcurrency',
  'maxConcurrency',
  'maxRequestRetries',
  'maxRequestsPerCrawl',
  'requestHandlerTimeoutSecs'
] as const
const configKeys = [
  'persistStorage',
  'purgeOnStart'
] as const
const configContents = await readFile('./config.json', 'utf-8')
const config: Record<string, any> = JSON.parse(configContents)

const crawlerContext: Pick<typeof config, typeof contextKeys[number]> = pick(config, contextKeys)
const crawlerConfig: Pick<typeof config, typeof configKeys[number]> = pick(config, configKeys)
const crawler = new HttpCrawler({
  ...crawlerContext,

  requestHandler: router,
  failedRequestHandler({ request }) {
    log.warning(`Request ${request.url} failed!`)
  },

  additionalMimeTypes: ['*/*']
}, new Configuration(crawlerConfig))

await crawler.run(config.startUrls)
