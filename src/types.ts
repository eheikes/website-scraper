import { InternalHttpCrawlingContext, Request } from 'crawlee'
import { IncomingHttpHeaders } from 'http'

export interface StoredBaseData {
  url: string
  headers: IncomingHttpHeaders
  mimeType: string
  size: number
}

export interface StoredTextData extends StoredBaseData {
  type: 'text'
  content: string
}

export interface StoredBinaryData extends StoredBaseData {
  type: 'binary'
  sha1: string
}

export type StoredData = StoredBinaryData | StoredTextData

export interface HandlerResponse {
  links: string[]
  data: Omit<StoredData, 'headers' | 'mimeType' | 'size' | 'url'>
}

export type Handler = (
  req: Request<any>,
  body: string | Buffer,
  cheerioParser: InternalHttpCrawlingContext['parseWithCheerio']
) => Promise<HandlerResponse>
