const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const hasCodespaceName =
  codespaceName &&
  codespaceName.toLowerCase() !== 'undefined' &&
  /^[a-z0-9-]+$/i.test(codespaceName)
const apiRoot = hasCodespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : '/api'

export function apiUrl(resource) {
  return `${apiRoot}/${resource}/`
}

export function toCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') {
    throw new Error('The API response is not a collection')
  }

  for (const key of ['results', 'items', 'docs']) {
    if (Array.isArray(payload[key])) return payload[key]
  }

  if (Array.isArray(payload.data)) return payload.data
  if (payload.data && typeof payload.data === 'object') return toCollection(payload.data)

  throw new Error('The API response does not contain a collection')
}
