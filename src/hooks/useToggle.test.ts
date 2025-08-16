import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useToggle } from './useToggle'

describe('useToggle', () => {
  it('should initialize with false by default', () => {
    const { result } = renderHook(() => useToggle())
    const [value] = result.current
    expect(value).toBe(false)
  })

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useToggle(true))
    const [value] = result.current
    expect(value).toBe(true)
  })

  it('should toggle value when toggle function is called', () => {
    const { result } = renderHook(() => useToggle(false))
    const [value, toggle] = result.current

    expect(value).toBe(false)

    act(() => {
      toggle()
    })

    expect(result.current[0]).toBe(true)

    act(() => {
      toggle()
    })

    expect(result.current[0]).toBe(false)
  })

  it('should set value to true when setTrue is called', () => {
    const { result } = renderHook(() => useToggle(false))
    const [value, , setTrue] = result.current

    expect(value).toBe(false)

    act(() => {
      setTrue()
    })

    expect(result.current[0]).toBe(true)
  })

  it('should set value to false when setFalse is called', () => {
    const { result } = renderHook(() => useToggle(true))
    const [value, , , setFalse] = result.current

    expect(value).toBe(true)

    act(() => {
      setFalse()
    })

    expect(result.current[0]).toBe(false)
  })

  it('should return all four functions in correct order', () => {
    const { result } = renderHook(() => useToggle(false))
    const [value, toggle, setTrue, setFalse] = result.current

    expect(typeof value).toBe('boolean')
    expect(typeof toggle).toBe('function')
    expect(typeof setTrue).toBe('function')
    expect(typeof setFalse).toBe('function')
  })

  it('should maintain state between renders', () => {
    const { result, rerender } = renderHook(() => useToggle(false))
    
    act(() => {
      result.current[1]() // toggle
    })

    expect(result.current[0]).toBe(true)

    rerender()

    expect(result.current[0]).toBe(true)
  })
}) 