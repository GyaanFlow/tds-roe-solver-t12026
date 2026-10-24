export function withTimeout(operation, timeoutMs, message) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  const result = Promise.resolve().then(operation);

  return Promise.race([result, timeout]).finally(() => clearTimeout(timeoutId));
}
