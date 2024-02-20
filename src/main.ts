import { HttpCrawler } from 'crawlee'
import { readFile } from 'fs/promises'
import { router } from './routes.js'

const configContents = await readFile('./config.json', 'utf-8')
const config = JSON.parse(configContents)

const crawler = new HttpCrawler({
  minConcurrency: config.minConcurrency,
  maxConcurrency: config.maxConcurrency,

  requestHandler: router,
  additionalMimeTypes: ['*/*'],

  maxRequestsPerCrawl: config.maxRequestsPerCrawl || undefined,
})

await crawler.run(config.startUrls)
