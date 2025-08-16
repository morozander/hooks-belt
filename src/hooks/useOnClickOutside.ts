import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * A hook that detects clicks outside of a specified element.
 * Useful for closing modals, dropdowns, or other UI elements when clicking outside.
 * 
 * @param ref - A ref to the element to detect clicks outside of
 * @param handler - The function to call when a click outside is detected
 * 
 * @example
 * ```tsx
 * const modalRef = useRef<HTMLDivElement>(null)
 * const [isOpen, setIsOpen] = useState(false)
 * 
 * useOnClickOutside(modalRef, () => setIsOpen(false))
 * 
 * return (
 *   {isOpen && (
 *     <div ref={modalRef} className="modal">
 *       Modal content
 *     </div>
 *   )}
 * )
 * ```
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current
      if (!el || el.contains((event?.target as Node) || null)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
} 