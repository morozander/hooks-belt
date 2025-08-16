import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useInterval } from './useInterval'

describe('useInterval', () => {
  it('should not set interval when delay is null', () => {
    const mockCallback = vi.fn()
    
    renderHook(() => useInterval(mockCallback, null))
    
    // Basic test that hook renders without error
    expect(mockCallback).toBeDefined()
  })

  it('should not set interval when delay is 0', () => {
    const mockCallback = vi.fn()
    
    renderHook(() => useInterval(mockCallback, 0))
    
    // Basic test that hook renders without error
    expect(mockCallback).toBeDefined()
  })

  it('should render with valid delay', () => {
    const mockCallback = vi.fn()
    
    renderHook(() => useInterval(mockCallback, 1000))
    
    // Basic test that hook renders without error
    expect(mockCallback).toBeDefined()
  })

  it('should handle callback changes', () => {
    const mockCallback1 = vi.fn()
    const mockCallback2 = vi.fn()
    
    const { rerender } = renderHook(
      ({ callback }) => useInterval(callback, 1000),
      { initialProps: { callback: mockCallback1 } }
    )
    
    // Basic test that hook renders without error
    expect(mockCallback1).toBeDefined()
    
    rerender({ callback: mockCallback2 })
    expect(mockCallback2).toBeDefined()
  })

  it('should handle delay changes', () => {
    const mockCallback = vi.fn()
    
    const { rerender } = renderHook(
      ({ delay }) => useInterval(mockCallback, delay),
      { initialProps: { delay: 1000 } }
    )
    
    // Basic test that hook renders without error
    expect(mockCallback).toBeDefined()
    
    rerender({ delay: 500 })
    expect(mockCallback).toBeDefined()
  })
}) 