import { useCallback, useRef } from 'react'

/**
 * A hook that throttles a function execution.
 * Ensures the function is called at most once in a specified time period.
 * 
 * @param func - The function to throttle
 * @param delay - The throttle delay in milliseconds
 * @returns A throttled version of the function
 * 
 * @example
 * ```tsx
 * const throttledScrollHandler = useThrottle(() => {
 *   console.log('Scroll event throttled')
 * }, 100)
 * 
 * useEffect(() => {
 *   window.addEventListener('scroll', throttledScrollHandler)
 *   return () => window.removeEventListener('scroll', throttledScrollHandler)
 * }, [throttledScrollHandler])
 * ```
 */
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  const lastExecuted = useRef<number>(0)
  const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined)

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastExecuted.current >= delay) {
        ;(func as any)(...args)
        lastExecuted.current = now
      } else {
        // Clear existing timeout
        if (timeoutId.current) {
          clearTimeout(timeoutId.current)
        }

        // Set new timeout
        const remainingDelay = delay - (now - lastExecuted.current)
        timeoutId.current = setTimeout(() => {
          ;(func as any)(...args)
          lastExecuted.current = Date.now()
        }, remainingDelay)
      }
    }) as T,
    [func, delay]
  )
} 