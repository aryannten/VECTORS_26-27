import { useState, useEffect } from 'react'

/**
 * useDebounce Hook
 * Debounces a value by a specified delay in milliseconds.
 * Prevents rapid re-renders and unnecessary computations on text inputs.
 *
 * @param {any} value - The input value to debounce
 * @param {number} delay - Delay in ms (default: 300ms)
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
