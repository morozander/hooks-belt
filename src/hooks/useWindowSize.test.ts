import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useWindowSize } from './useWindowSize'

describe('useWindowSize', () => {
  let originalInnerWidth: number
  let originalInnerHeight: number
  let mockAddEventListener: any
  let mockRemoveEventListener: any

  beforeEach(() => {
    // Store original values
    originalInnerWidth = window.innerWidth
    originalInnerHeight = window.innerHeight

    // Mock event listeners
    mockAddEventListener = vi.fn()
    mockRemoveEventListener = vi.fn()

    Object.defineProperty(window, 'addEventListener', {
      value: mockAddEventListener,
      writable: true,
    })

    Object.defineProperty(window, 'removeEventListener', {
      value: mockRemoveEventListener,
      writable: true,
    })
  })

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      writable: true,
    })
    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
      writable: true,
    })
  })

  it('should return initial window dimensions', () => {
    const { result } = renderHook(() => useWindowSize())
    
    expect(result.current.width).toBe(window.innerWidth)
    expect(result.current.height).toBe(window.innerHeight)
  })

  it('should add resize event listener', () => {
    renderHook(() => useWindowSize())
    
    expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('should remove resize event listener on cleanup', () => {
    const { unmount } = renderHook(() => useWindowSize())
    
    unmount()
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('should update dimensions when window is resized', () => {
    let resizeHandler: any
    
    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'resize') {
        resizeHandler = handler
      }
    })

    const { result } = renderHook(() => useWindowSize())
    
    // Simulate window resize
    const newWidth = 1200
    const newHeight = 800
    
    Object.defineProperty(window, 'innerWidth', {
      value: newWidth,
      writable: true,
    })
    Object.defineProperty(window, 'innerHeight', {
      value: newHeight,
      writable: true,
    })

    if (resizeHandler) {
      act(() => {
        resizeHandler()
      })
    }

    expect(result.current.width).toBe(newWidth)
    expect(result.current.height).toBe(newHeight)
  })

  it('should handle multiple resize events', () => {
    let resizeHandler: any
    
    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'resize') {
        resizeHandler = handler
      }
    })

    const { result } = renderHook(() => useWindowSize())
    
    // First resize
    Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 600, writable: true })
    
    if (resizeHandler) {
      act(() => {
        resizeHandler()
      })
    }

    expect(result.current.width).toBe(1000)
    expect(result.current.height).toBe(600)

    // Second resize
    Object.defineProperty(window, 'innerWidth', { value: 1400, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 900, writable: true })
    
    if (resizeHandler) {
      act(() => {
        resizeHandler()
      })
    }

    expect(result.current.width).toBe(1400)
    expect(result.current.height).toBe(900)
  })

  it('should work with different window dimensions', () => {
    const dimensions = [
      { width: 320, height: 568 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1920, height: 1080 }, // Desktop
      { width: 2560, height: 1440 }, // Large Desktop
    ]

    let resizeHandler: any
    
    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'resize') {
        resizeHandler = handler
      }
    })

    const { result } = renderHook(() => useWindowSize())

    for (const dim of dimensions) {
      Object.defineProperty(window, 'innerWidth', { value: dim.width, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: dim.height, writable: true })
      
      if (resizeHandler) {
        act(() => {
          resizeHandler()
        })
      }

      expect(result.current.width).toBe(dim.width)
      expect(result.current.height).toBe(dim.height)
    }
  })

  it('should handle zero dimensions', () => {
    let resizeHandler: any
    
    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'resize') {
        resizeHandler = handler
      }
    })

    const { result } = renderHook(() => useWindowSize())
    
    Object.defineProperty(window, 'innerWidth', { value: 0, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 0, writable: true })
    
    if (resizeHandler) {
      act(() => {
        resizeHandler()
      })
    }

    expect(result.current.width).toBe(0)
    expect(result.current.height).toBe(0)
  })

  it('should handle very large dimensions', () => {
    let resizeHandler: any
    
    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'resize') {
        resizeHandler = handler
      }
    })

    const { result } = renderHook(() => useWindowSize())
    
    const largeWidth = 3840
    const largeHeight = 2160
    
    Object.defineProperty(window, 'innerWidth', { value: largeWidth, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: largeHeight, writable: true })
    
    if (resizeHandler) {
      act(() => {
        resizeHandler()
      })
    }

    expect(result.current.width).toBe(largeWidth)
    expect(result.current.height).toBe(largeHeight)
  })

  it('should handle decimal dimensions', () => {
    let resizeHandler: any
    
    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'resize') {
        resizeHandler = handler
      }
    })

    const { result } = renderHook(() => useWindowSize())
    
    const decimalWidth = 1366.5
    const decimalHeight = 768.25
    
    Object.defineProperty(window, 'innerWidth', { value: decimalWidth, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: decimalHeight, writable: true })
    
    if (resizeHandler) {
      act(() => {
        resizeHandler()
      })
    }

    expect(result.current.width).toBe(decimalWidth)
    expect(result.current.height).toBe(decimalHeight)
  })

  it('should maintain state between renders', () => {
    let resizeHandler: any
    
    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'resize') {
        resizeHandler = handler
      }
    })

    const { result, rerender } = renderHook(() => useWindowSize())
    
    // Resize window
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })
    
    if (resizeHandler) {
      act(() => {
        resizeHandler()
      })
    }

    expect(result.current.width).toBe(1200)
    expect(result.current.height).toBe(800)

    // Rerender hook
    rerender()

    // Dimensions should remain the same
    expect(result.current.width).toBe(1200)
    expect(result.current.height).toBe(800)
  })

  it('should handle rapid resize events', () => {
    let resizeHandler: any
    
    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'resize') {
        resizeHandler = handler
      }
    })

    const { result } = renderHook(() => useWindowSize())
    
    // Simulate rapid resize events
    const rapidDimensions = [
      { width: 1000, height: 600 },
      { width: 1100, height: 700 },
      { width: 1200, height: 800 },
      { width: 1300, height: 900 },
    ]

    for (const dim of rapidDimensions) {
      Object.defineProperty(window, 'innerWidth', { value: dim.width, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: dim.height, writable: true })
      
      if (resizeHandler) {
        act(() => {
          resizeHandler()
        })
      }
    }

    // Should have the last dimensions
    expect(result.current.width).toBe(1300)
    expect(result.current.height).toBe(900)
  })
}) 