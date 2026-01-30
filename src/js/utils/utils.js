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
