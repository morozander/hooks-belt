import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    // Change the value
    rerender({ value: 'changed', delay: 500 })
    
    // Value should still be the old one
    expect(result.current).toBe('initial')

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Now the value should be updated
    expect(result.current).toBe('changed')
  })

  it('should use default delay of 500ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'changed' })
    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('changed')
  })

  it('should cancel previous timeout when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    // Change value multiple times rapidly
    rerender({ value: 'changed1', delay: 500 })
    rerender({ value: 'changed2', delay: 500 })
    rerender({ value: 'changed3', delay: 500 })

    // Fast forward less than the delay
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Value should still be initial
    expect(result.current).toBe('initial')

    // Fast forward to complete the delay
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // Should show the last value
    expect(result.current).toBe('changed3')
  })

  it('should work with different types', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 100 } }
    )

    rerender({ value: 42, delay: 100 })
    expect(result.current).toBe(0)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe(42)
  })
}) 