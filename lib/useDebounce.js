import { useState, useEffect } from 'react';

/**
 * Helper to start a search after the user has stopped entering letters for a certain number of seconds
 * @param {String} value
 * @param {Number} delay
 */
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
