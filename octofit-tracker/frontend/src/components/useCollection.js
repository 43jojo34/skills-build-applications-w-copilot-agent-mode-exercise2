import { useEffect, useState } from 'react'
import { toCollection } from '../api.js'

export default function useCollection(resource, endpoint) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    fetch(endpoint, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed (${response.status})`)
        return response.json()
      })
      .then((payload) => {
        setItems(toCollection(payload))
        setStatus('ready')
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') return
        setError(requestError.message || 'Unable to load data')
        setStatus('error')
      })

    return () => controller.abort()
  }, [endpoint, resource])

  return { items, status, error }
}
