/**
 * Create a debounced version of a function.
 * @template T
 * @param {(...args: any[]) => Promise<T> | T} fn - Function to debounce.
 * @param {number} [delay=300] - Delay in milliseconds.
 * @returns {(...args: any[]) => Promise<T>} Debounced function.
 */
export function debounce(fn, delay = 300) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          resolve(await fn.apply(this, args));
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}
