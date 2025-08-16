import { useState, useCallback } from 'react'

/**
 * A hook that provides a boolean state with toggle functionality.
 * Useful for managing boolean states like modals, dropdowns, etc.
 * 
 * @param initialValue - The initial boolean value (default: false)
 * @returns A tuple with the current value and toggle functions
 * 
 * @example
 * ```tsx
 * const [isOpen, toggle, setOpen, setClosed] = useToggle(false)
 * 
 * return (
 *   <div>
 *     <button onClick={toggle}>Toggle</button>
 *     <button onClick={setOpen}>Open</button>
 *     <button onClick={setClosed}>Close</button>
 *     {isOpen && <Modal />}
 *   </div>
 * )
 * ```
 */
export function useToggle(initialValue: boolean = false): [
  boolean,
  () => void,
  () => void,
  () => void
] {
  const [value, setValue] = useState<boolean>(initialValue)

  const toggle = useCallback(() => {
    setValue(prev => !prev)
  }, [])

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  return [value, toggle, setTrue, setFalse]
} 