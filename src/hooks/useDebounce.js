import { useEffect, useState } from "react";

/**
 * Debounce a value.
 *
 * Delays updating the returned value until
 * the user stops changing the input for the
 * specified delay.
 *
 * @param {*} value
 * @param {number} delay
 * @returns {*}
 */
export default function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
