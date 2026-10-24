export function shouldEnableNetworkCanvas(options = {}) {
  const browserWindow = options.window ?? globalThis.window;
  const browserNavigator = options.navigator ?? globalThis.navigator;
  const width = Number(options.width ?? browserWindow?.innerWidth ?? 0);
  const reducedMotion = options.reducedMotion
    ?? browserWindow?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    ?? false;
  const connection = options.connection ?? browserNavigator?.connection;
  const saveData = options.saveData ?? connection?.saveData ?? false;
  const effectiveType = options.effectiveType ?? connection?.effectiveType ?? '';
  const cores = Number(options.hardwareConcurrency ?? browserNavigator?.hardwareConcurrency ?? 0);
  const memory = Number(options.deviceMemory ?? browserNavigator?.deviceMemory ?? 0);

  return width > 760
    && !reducedMotion
    && !saveData
    && !['slow-2g', '2g'].includes(effectiveType)
    && !(cores > 0 && cores <= 4)
    && !(memory > 0 && memory <= 4);
}
