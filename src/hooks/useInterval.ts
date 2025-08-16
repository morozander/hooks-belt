import { useEffect, useRef } from 'react'

/**
 * A hook that provides a way to run a function at regular intervals.
 * Automatically handles cleanup and can be paused/resumed.
 * 
 * @param callback - The function to call on each interval
 * @param delay - The delay between calls in milliseconds (null to pause)
 * 
 * @example
 * ```tsx
 * const [count, setCount] = useState(0)
 * const [isRunning, setIsRunning] = useState(true)
 * 
 * useInterval(
 *   () => setCount(c => c + 1),
 *   isRunning ? 1000 : null
 * )
 * 
 * return (
 *   <div>
 *     Count: {count}
 *     <button onClick={() => setIsRunning(!isRunning)}>
 *       {isRunning ? 'Pause' : 'Resume'}
 *     </button>
 *   </div>
 * )
 * ```
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>(() => {})

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval
  useEffect(() => {
    // Don't schedule if no delay is specified
    if (delay === null) {
      return
    }

    const id = setInterval(() => {
      savedCallback.current?.()
    }, delay)

    return () => clearInterval(id)
  }, [delay])
} 