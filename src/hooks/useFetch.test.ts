import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useFetch } from './useFetch'

// Mock fetch globally
global.fetch = vi.fn()

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useFetch('/api/test'))
    
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' }
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    }
    
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useFetch('/api/test'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBe(null)
    expect(global.fetch).toHaveBeenCalledWith('/api/test', undefined)
  })

  it('should handle fetch errors', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
    }
    
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useFetch('/api/test'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('HTTP error! status: 404')
  })

  it('should handle network errors', async () => {
    const networkError = new Error('Network error')
    ;(global.fetch as any).mockRejectedValue(networkError)

    const { result } = renderHook(() => useFetch('/api/test'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Network error')
  })

  it('should handle JSON parsing errors', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    }
    
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useFetch('/api/test'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Invalid JSON')
  })

  it('should pass fetch options', async () => {
    const mockData = { id: 1 }
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    }
    
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true }),
    }
    
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useFetch('/api/test', fetchOptions))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/test', fetchOptions)
  })

  it('should refetch data when refetch is called', async () => {
    const mockData1 = { id: 1, name: 'First' }
    const mockData2 = { id: 2, name: 'Second' }
    
    const mockResponse1 = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData1),
    }
    
    const mockResponse2 = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockData2),
    }
    
    ;(global.fetch as any)
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2)

    const { result } = renderHook(() => useFetch('/api/test'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData1)

    // Call refetch
    act(() => {
      result.current.refetch()
    })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData2)
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('should handle generic types correctly', async () => {
    interface User {
      id: number
      name: string
      email: string
    }

    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    }
    
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockUser),
    }
    
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useFetch<User>('/api/users/1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockUser)
    expect(result.current.data?.name).toBe('John Doe')
  })

  it('should handle array responses', async () => {
    const mockUsers = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]
    
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockUsers),
    }
    
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useFetch('/api/users'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockUsers)
    expect(Array.isArray(result.current.data)).toBe(true)
  })

  it('should handle empty responses', async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(null),
    }
    
    ;(global.fetch as any).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useFetch('/api/test'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should handle different HTTP status codes', async () => {
    const statusCodes = [400, 401, 403, 500]
    
    for (const statusCode of statusCodes) {
      const mockResponse = {
        ok: false,
        status: statusCode,
      }
      
      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useFetch('/api/test'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error?.message).toBe(`HTTP error! status: ${statusCode}`)
    }
  })

  it('should handle fetch with different HTTP methods', async () => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    
    for (const method of methods) {
      const mockData = { method }
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      }
      
      const options = { method }
      ;(global.fetch as any).mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useFetch('/api/test', options))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(global.fetch).toHaveBeenCalledWith('/api/test', options)
    }
  })
}) 