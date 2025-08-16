import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { usePrevious } from './usePrevious'

describe('usePrevious', () => {
  it('should return undefined on first render', () => {
    const { result } = renderHook(() => usePrevious('initial'))
    
    expect(result.current).toBeUndefined()
  })

  it('should return previous value on subsequent renders', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'initial' } }
    )
    
    // First render
    expect(result.current).toBeUndefined()
    
    // Second render
    rerender({ value: 'updated' })
    expect(result.current).toBe('initial')
    
    // Third render
    rerender({ value: 'final' })
    expect(result.current).toBe('updated')
  })

  it('should work with primitive values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 0 } }
    )
    
    expect(result.current).toBeUndefined()
    
    rerender({ value: 42 })
    expect(result.current).toBe(0)
    
    rerender({ value: 100 })
    expect(result.current).toBe(42)
  })

  it('should work with boolean values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: false } }
    )
    
    expect(result.current).toBeUndefined()
    
    rerender({ value: true })
    expect(result.current).toBe(false)
    
    rerender({ value: false })
    expect(result.current).toBe(true)
  })

  it('should work with null and undefined', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: null as any } }
    )
    
    expect(result.current).toBeUndefined()
    
    rerender({ value: undefined as any })
    expect(result.current).toBe(null)
    
    rerender({ value: 'string' as any })
    expect(result.current).toBeUndefined()
  })

  it('should work with objects', () => {
    const initialObj = { name: 'John', age: 30 }
    const updatedObj = { name: 'Jane', age: 25 }
    const finalObj = { name: 'Bob', age: 40 }
    
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: initialObj } }
    )
    
    expect(result.current).toBeUndefined()
    
    rerender({ value: updatedObj })
    expect(result.current).toBe(initialObj)
    
    rerender({ value: finalObj })
    expect(result.current).toBe(updatedObj)
  })

  it('should work with arrays', () => {
    const initialArray = [1, 2, 3]
    const updatedArray = [4, 5, 6]
    const finalArray = [7, 8, 9]
    
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: initialArray } }
    )
    
    expect(result.current).toBeUndefined()
    
    rerender({ value: updatedArray })
    expect(result.current).toBe(initialArray)
    
    rerender({ value: finalArray })
    expect(result.current).toBe(updatedArray)
  })

  it('should work with functions', () => {
    const initialFn = () => 'initial'
    const updatedFn = () => 'updated'
    const finalFn = () => 'final'
    
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: initialFn } }
    )
    
    expect(result.current).toBeUndefined()
    
    rerender({ value: updatedFn })
    expect(result.current).toBe(initialFn)
    
    rerender({ value: finalFn })
    expect(result.current).toBe(updatedFn)
  })

  it('should handle multiple rapid rerenders', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'a' } }
    )
    
    expect(result.current).toBeUndefined()
    
    // Multiple rapid rerenders
    rerender({ value: 'b' })
    rerender({ value: 'c' })
    rerender({ value: 'd' })
    
    expect(result.current).toBe('c')
  })

  it('should maintain reference equality for same values', () => {
    const sameObject = { id: 1 }
    
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: sameObject } }
    )
    
    expect(result.current).toBeUndefined()
    
    // Rerender with same object reference
    rerender({ value: sameObject })
    expect(result.current).toBe(sameObject)
    
    // Rerender with different object but same content
    rerender({ value: { id: 1 } })
    expect(result.current).toBe(sameObject)
  })

  it('should work with complex nested objects', () => {
    const initialObj = {
      user: {
        profile: {
          name: 'John',
          settings: { theme: 'dark', notifications: true }
        }
      }
    }
    
    const updatedObj = {
      user: {
        profile: {
          name: 'Jane',
          settings: { theme: 'light', notifications: false }
        }
      }
    }
    
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: initialObj } }
    )
    
    expect(result.current).toBeUndefined()
    
    rerender({ value: updatedObj })
    expect(result.current).toBe(initialObj)
  })
}) 