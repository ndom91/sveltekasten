export type Cookie = Record<string, string>

// all alphanumeric chars and all of _!#$%&'*.^`|~+-
// (see: https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1)
const validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/

// The spec also prohibits comma and space, but we allow both since they are very common in the real world
// (see: https://github.com/golang/go/issues/7243)
const validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/

export const parseCookiesToObject = (cookie: string, name?: string): Cookie => {
  const pairs = cookie.trim().split(";")
  return pairs.reduce((parsedCookie, pairStr) => {
    pairStr = pairStr.trim()
    const valueStartPos = pairStr.indexOf("=")
    if (valueStartPos === -1) {
      return parsedCookie
    }

    const cookieName = pairStr.substring(0, valueStartPos).trim()
    if ((name && name !== cookieName) || !validCookieNameRegEx.test(cookieName)) {
      return parsedCookie
    }

    let cookieValue = pairStr.substring(valueStartPos + 1).trim()
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1)
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = decodeURIComponent(cookieValue)
    }

    return parsedCookie
  }, {} as Cookie)
}
