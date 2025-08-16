import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useMediaQuery } from './useMediaQuery'

describe('useMediaQuery', () => {
  let mockMatchMedia: any

  beforeEach(() => {
    // Mock matchMedia
    mockMatchMedia = vi.fn()
    
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return false initially when no matchMedia', () => {
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    
    expect(result.current).toBe(false)
  })

  it('should return true when media query matches', () => {
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })

    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    
    expect(result.current).toBe(true)
  })

  it('should add event listener for media query changes', () => {
    const addEventListener = vi.fn()
    const removeEventListener = vi.fn()
    
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    })

    renderHook(() => useMediaQuery('(max-width: 768px)'))
    
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should remove event listener on cleanup', () => {
    const addEventListener = vi.fn()
    const removeEventListener = vi.fn()
    
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    })

    const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'))
    
    unmount()
    
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should work with different media query strings', () => {
    const addEventListener = vi.fn()
    const removeEventListener = vi.fn()
    
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener,
      removeEventListener,
    })

    const { result } = renderHook(() => useMediaQuery('(prefers-color-scheme: dark)'))
    
    expect(result.current).toBe(true)
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
  })

  it('should handle media query with no spaces', () => {
    const addEventListener = vi.fn()
    const removeEventListener = vi.fn()
    
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    })

    const { result } = renderHook(() => useMediaQuery('(orientation:portrait)'))
    
    expect(result.current).toBe(false)
    expect(mockMatchMedia).toHaveBeenCalledWith('(orientation:portrait)')
  })

  it('should handle complex media queries', () => {
    const addEventListener = vi.fn()
    const removeEventListener = vi.fn()
    
    mockMatchMedia.mockReturnValue({
      matches: true,
      addEventListener,
      removeEventListener,
    })

    const complexQuery = '(max-width: 768px) and (orientation: landscape)'
    const { result } = renderHook(() => useMediaQuery(complexQuery))
    
    expect(result.current).toBe(true)
    expect(mockMatchMedia).toHaveBeenCalledWith(complexQuery)
  })
}) 