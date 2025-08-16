import { useState, useEffect } from 'react'

/**
 * A hook that tracks the window dimensions.
 * Automatically updates when the window is resized.
 * 
 * @returns An object with width and height of the window
 * 
 * @example
 * ```tsx
 * const { width, height } = useWindowSize()
 * 
 * return (
 *   <div>
 *     Window size: {width} x {height}
 *     {width < 768 && <MobileMenu />}
 *   </div>
 * )
 * ```
 */
export function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
} 