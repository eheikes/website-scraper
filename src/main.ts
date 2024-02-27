import { Configuration, Dataset, HttpCrawler, log, Sitemap } from 'crawlee'
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

// Init the crawler.
const crawlerContext: Pick<typeof config, typeof contextKeys[number]> = pick(config, contextKeys)
const crawlerConfig: Pick<typeof config, typeof configKeys[number]> = pick(config, configKeys)
const crawler = new HttpCrawler({
  ...crawlerContext,
  maxRequestsPerCrawl: crawlerContext.maxRequestsPerCrawl === null ? undefined : crawlerContext.maxRequestsPerCrawl,

  requestHandler: router,
  failedRequestHandler({ request }) {
    log.warning(`Request ${request.url} failed!`)
  },

  additionalMimeTypes: ['*/*']
}, new Configuration(crawlerConfig))

// Also scrape from the sitemap, if given.
if (config.sitemap) {
  const { urls } = await Sitemap.load(config.sitemap)
  for (const url of urls) {
    log.info(`enqueueing new URL from sitemap`, { url })
    await crawler.addRequests([url])
  }
}

// Run the crawler.
await crawler.run(config.startUrls)

// Export to CSV and/or JSON, if specified.
if (config.csvExport) {
  await Dataset.exportToCSV(config.csvExport)
}
if (config.jsonExport) {
  await Dataset.exportToJSON(config.jsonExport)
}
