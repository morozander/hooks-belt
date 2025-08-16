import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useOnClickOutside } from './useOnClickOutside'

describe('useOnClickOutside', () => {
  let mockAddEventListener: any
  let mockRemoveEventListener: any

  beforeEach(() => {
    // Mock document event listeners
    mockAddEventListener = vi.fn()
    mockRemoveEventListener = vi.fn()
    
    Object.defineProperty(document, 'addEventListener', {
      value: mockAddEventListener,
      writable: true,
    })
    
    Object.defineProperty(document, 'removeEventListener', {
      value: mockRemoveEventListener,
      writable: true,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should add mousedown and touchstart event listeners', () => {
    const mockRef = { current: document.createElement('div') }
    const mockHandler = vi.fn()

    renderHook(() => useOnClickOutside(mockRef, mockHandler))

    expect(mockAddEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function))
    expect(mockAddEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function))
  })

  it('should remove event listeners on cleanup', () => {
    const mockRef = { current: document.createElement('div') }
    const mockHandler = vi.fn()

    const { unmount } = renderHook(() => useOnClickOutside(mockRef, mockHandler))

    unmount()

    expect(mockRemoveEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function))
    expect(mockRemoveEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function))
  })

  it('should not call handler when click is inside the element', () => {
    const mockElement = document.createElement('div')
    const mockRef = { current: mockElement }
    const mockHandler = vi.fn()

    let mousedownHandler: any

    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'mousedown') mousedownHandler = handler
    })

    renderHook(() => useOnClickOutside(mockRef, mockHandler))

    // Simulate click inside the element
    const mockEvent = {
      target: mockElement,
    }

    if (mousedownHandler) {
      mousedownHandler(mockEvent)
    }

    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('should call handler when click is outside the element', () => {
    const mockElement = document.createElement('div')
    const mockRef = { current: mockElement }
    const mockHandler = vi.fn()

    let mousedownHandler: any

    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'mousedown') mousedownHandler = handler
    })

    renderHook(() => useOnClickOutside(mockRef, mockHandler))

    // Simulate click outside the element
    const mockEvent = {
      target: document.createElement('span'),
    }

    if (mousedownHandler) {
      mousedownHandler(mockEvent)
    }

    expect(mockHandler).toHaveBeenCalledWith(mockEvent)
  })

  it('should handle null ref gracefully', () => {
    const mockRef = { current: null } as any
    const mockHandler = vi.fn()

    renderHook(() => useOnClickOutside(mockRef, mockHandler))

    // Should not throw error
    expect(mockAddEventListener).toHaveBeenCalled()
  })

  it('should handle undefined ref gracefully', () => {
    const mockRef = { current: undefined } as any
    const mockHandler = vi.fn()

    renderHook(() => useOnClickOutside(mockRef, mockHandler))

    // Should not throw error
    expect(mockAddEventListener).toHaveBeenCalled()
  })

  it('should handle element that contains the target', () => {
    const mockElement = document.createElement('div')
    const mockRef = { current: mockElement }
    const mockHandler = vi.fn()

    // Create a child element
    const childElement = document.createElement('span')
    mockElement.appendChild(childElement)

    let mousedownHandler: any

    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'mousedown') mousedownHandler = handler
    })

    renderHook(() => useOnClickOutside(mockRef, mockHandler))

    // Simulate click on child element
    const mockEvent = {
      target: childElement,
    }

    if (mousedownHandler) {
      mousedownHandler(mockEvent)
    }

    expect(mockHandler).not.toHaveBeenCalled()
  })

  it('should handle mousedown events', () => {
    const mockElement = document.createElement('div')
    const mockRef = { current: mockElement }
    const mockHandler = vi.fn()

    let mousedownHandler: any

    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'mousedown') mousedownHandler = handler
    })

    renderHook(() => useOnClickOutside(mockRef, mockHandler))

    // Simulate mousedown outside
    const mousedownEvent = { target: document.createElement('span') }
    if (mousedownHandler) {
      mousedownHandler(mousedownEvent)
    }

    expect(mockHandler).toHaveBeenCalledTimes(1)
    expect(mockHandler).toHaveBeenCalledWith(mousedownEvent)
  })

  it('should handle event target that is null', () => {
    const mockElement = document.createElement('div')
    const mockRef = { current: mockElement }
    const mockHandler = vi.fn()

    let mousedownHandler: any

    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'mousedown') mousedownHandler = handler
    })

    renderHook(() => useOnClickOutside(mockRef, mockHandler))

    // Simulate event with null target
    const mockEvent = {
      target: null,
    }

    if (mousedownHandler) {
      mousedownHandler(mockEvent)
    }

    expect(mockHandler).toHaveBeenCalledWith(mockEvent)
  })

  it('should work with different element types', () => {
    const mockButton = document.createElement('button')
    const mockRef = { current: mockButton }
    const mockHandler = vi.fn()

    let mousedownHandler: any

    mockAddEventListener.mockImplementation((event: string, handler: any) => {
      if (event === 'mousedown') mousedownHandler = handler
    })

    renderHook(() => useOnClickOutside(mockRef, mockHandler))

    // Simulate click outside
    const mockEvent = {
      target: document.createElement('input'),
    }

    if (mousedownHandler) {
      mousedownHandler(mockEvent)
    }

    expect(mockHandler).toHaveBeenCalledWith(mockEvent)
  })
}) 