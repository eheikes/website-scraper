export const toAbsoluteUrl = (origin: string) => (url: string): string => {
  const parsedUrl = new URL(url, origin)
  return parsedUrl.toString()
}

export const sameDomainAs = (domainToMatch: string) => (url: string): boolean => {
  const parsedUrl = new URL(url, `https://${domainToMatch}`)
  return parsedUrl.hostname === domainToMatch
}
