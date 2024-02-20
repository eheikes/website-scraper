import { Handler } from '../types.js'

export const handle: Handler = async (_request, body) => {
  return {
    links: [],
    data: {
      type: 'text',
      content: body.toString()
    }
  }
}
