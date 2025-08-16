import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
  }

  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    })
    
    // Clear all mocks
    vi.clearAllMocks()
  })

  it('should initialize with the provided initial value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    const [value] = result.current
    expect(value).toBe('initial-value')
  })

  it('should read from localStorage on initialization', () => {
    mockLocalStorage.getItem.mockReturnValue('"stored-value"')
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    const [value] = result.current
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
    expect(value).toBe('stored-value')
  })

  it('should handle localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })
    
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    const [value] = result.current
    
    expect(value).toBe('initial-value')
    expect(consoleSpy).toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })

  it('should update value and localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    const [, setValue] = result.current

    act(() => {
      setValue('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', '"new-value"')
  })

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))
    const [, setValue] = result.current

    act(() => {
      setValue(prev => prev + 1)
    })

    expect(result.current[0]).toBe(1)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', '1')
  })

  it('should handle localStorage setItem errors gracefully', () => {
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('setItem error')
    })
    
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'))
    const [, setValue] = result.current

    act(() => {
      setValue('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(consoleSpy).toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })

  it('should work with complex objects', () => {
    const initialValue = { name: 'John', age: 30 }
    const { result } = renderHook(() => useLocalStorage('user', initialValue))
    const [, setValue] = result.current

    const newValue = { name: 'Jane', age: 25 }
    act(() => {
      setValue(newValue)
    })

    expect(result.current[0]).toEqual(newValue)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(newValue))
  })

  it('should work with arrays', () => {
    const initialValue = [1, 2, 3]
    const { result } = renderHook(() => useLocalStorage('numbers', initialValue))
    const [, setValue] = result.current

    const newValue = [4, 5, 6]
    act(() => {
      setValue(newValue)
    })

    expect(result.current[0]).toEqual(newValue)
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('numbers', JSON.stringify(newValue))
  })
}) 