import { useState, useEffect, useCallback } from 'react'

/**
 * A hook that provides a way to fetch data with loading and error states.
 * Automatically handles the fetch lifecycle and provides a clean API.
 * 
 * @param url - The URL to fetch from
 * @param options - Optional fetch options
 * @returns An object with data, loading state, error state, and refetch function
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useFetch('/api/users')
 * 
 * if (loading) return <div>Loading...</div>
 * if (error) return <div>Error: {error.message}</div>
 * 
 * return (
 *   <div>
 *     {data?.map(user => <User key={user.id} user={user} />)}
 *     <button onClick={refetch}>Refresh</button>
 *   </div>
 * )
 * ```
 */
export function useFetch<T = any>(
  url: string,
  options?: RequestInit
): {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
} {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(url, options)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
} 