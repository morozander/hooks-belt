import { useRef, useEffect } from 'react'

/**
 * A hook that returns the previous value of a state or prop.
 * Useful for comparing current and previous values in useEffect.
 * 
 * @param value - The current value
 * @returns The previous value (undefined on first render)
 * 
 * @example
 * ```tsx
 * const [count, setCount] = useState(0)
 * const previousCount = usePrevious(count)
 * 
 * useEffect(() => {
 *   if (previousCount !== undefined && count > previousCount) {
 *     console.log('Count increased!')
 *   }
 * }, [count, previousCount])
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  })

  return ref.current
} 