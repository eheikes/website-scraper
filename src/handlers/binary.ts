import { createHash } from 'crypto'
import { Handler } from '../types.js'

export const handle: Handler = async (_request, body) => {
  const shasum = createHash('sha1')
  shasum.update(body)
  return {
    links: [],
    data: {
      type: 'binary',
      sha1: shasum.digest('hex')
    }
  }
}
