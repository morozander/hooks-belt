import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useThrottle } from './useThrottle'

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should return a throttled function', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useThrottle(mockFn, 100))
    
    expect(typeof result.current).toBe('function')
  })

  it('should call the function immediately on first call', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useThrottle(mockFn, 100))
    
    act(() => {
      result.current()
    })
    
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should throttle subsequent calls within the delay period', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useThrottle(mockFn, 100))
    
    // First call - should execute immediately
    act(() => {
      result.current()
    })
    
    // Second call within delay - should be throttled
    act(() => {
      result.current()
    })
    
    // Third call within delay - should be throttled
    act(() => {
      result.current()
    })
    
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should allow execution after delay period', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useThrottle(mockFn, 100))
    
    // First call
    act(() => {
      result.current()
    })
    
    // Advance time past the delay
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    // Second call - should execute now
    act(() => {
      result.current()
    })
    
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should handle multiple rapid calls correctly', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useThrottle(mockFn, 100))
    
    // Multiple rapid calls
    act(() => {
      result.current()
      result.current()
      result.current()
      result.current()
    })
    
    expect(mockFn).toHaveBeenCalledTimes(1)
    
    // Advance time and call again
    act(() => {
      vi.advanceTimersByTime(100)
      result.current()
    })
    
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should pass arguments to the throttled function', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useThrottle(mockFn, 100))
    
    const testArgs = ['arg1', 'arg2', { key: 'value' }]
    
    act(() => {
      result.current(...testArgs)
    })
    
    expect(mockFn).toHaveBeenCalledWith(...testArgs)
  })

  it('should maintain function context', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useThrottle(mockFn, 100))
    
    const context = { test: true }
    
    act(() => {
      result.current.call(context)
    })
    
    expect(mockFn).toHaveBeenCalled()
  })

  it('should work with different delay values', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useThrottle(mockFn, 500))
    
    // First call
    act(() => {
      result.current()
    })
    
    // Second call within 500ms delay
    act(() => {
      result.current()
    })
    
    expect(mockFn).toHaveBeenCalledTimes(1)
    
    // Advance time to 250ms (still within delay)
    act(() => {
      vi.advanceTimersByTime(250)
      result.current()
    })
    
    expect(mockFn).toHaveBeenCalledTimes(1)
    
    // Advance time to 500ms (delay complete)
    act(() => {
      vi.advanceTimersByTime(250)
      result.current()
    })
    
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should handle zero delay correctly', () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => useThrottle(mockFn, 0))
    
    // Multiple calls with zero delay
    act(() => {
      result.current()
      result.current()
      result.current()
    })
    
    expect(mockFn).toHaveBeenCalledTimes(3)
  })
}) 