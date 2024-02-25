# Website Scraper

This is a [crawlee](https://crawlee.dev/) app for scraping a website. It builds a JSON-formatted inventory of a website's assets and pages that can be used in tests and other things.

* It was adapted from the `Crawlee + CherioCrawler + Typescript` template.
* It does not support Javascript-heavy websites or SPAs.

## Install

Requires [Node.js+npm](https://nodejs.org).

1. Download or clone this project.
1. Run `npm install` on the command line in the folder.

## Usage

1. Modify the `config.json` file as needed. The following options are supported:
    * `minConcurrency` (number) -- The minimum number of parallel requests that can run at any given time.
    * `maxConcurrency` (number) -- The maximum number of parallel requests that can run at any given time.
    * `maxRequestRetries` (number) -- The maximum number of times to retry a URL.
    * `maxRequestsPerCrawl` (number) -- The maximum number of URLs that the scraper will crawl. This should usually be `null` except when testing.
    * `persistStorage` (boolean) -- Whether or not to keep a cache. This should usually be `true`.
    * `purgeOnStart` (boolean) -- Whether or not to delete the data collection when starting the scraper.
    * `requestHandlerTimeoutSecs` (number) -- How long to wait (in seconds) for the website to respond. Increase this for larger pages/assets or slower sites.
    * `sitemap` (text) -- URL of a sitemap.xml file that contains URLs to crawl.
1. Run `npm start`, or run `npm run build` then `npm run start:prod`.

The resulting dataset will be in the `storage/datasets/default/` folder.
