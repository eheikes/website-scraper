# Website Scraper

This is a [crawlee](https://crawlee.dev/) app for scraping a website. It builds a JSON-formatted inventory of a website's assets and pages that can be used in tests and other things.

* It was adapted from the `Crawlee + CherioCrawler + Typescript` template.
* It does not support Javascript-heavy websites or SPAs.

## Install

Requires [Node.js+npm](https://nodejs.org).

1. Download or clone this project.
1. Run `npm install` on the command line in the folder.

## Usage

1. Modify the `config.json` file as needed.
1. Run `npm start`, or run `npm run build` then `npm run start:prod`.

The resulting dataset will be in the `storage/datasets/default/` folder.
