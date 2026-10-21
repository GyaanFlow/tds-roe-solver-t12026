// Device-readiness checks for the P1 "Air Ink" question (draw three character codes by tilting a phone).
// The exercise itself must be done by the student, by hand, on a phone — this only reports whether the phone and
// browser are able to run it, and asks for the sensor permissions up front so a prompt does not interrupt the drawing.
// `env` defaults to the real browser globals and is injectable so Node tests can fake a phone.

const status = (id, label, state, detail) => ({ id, label, status: state, detail });

export function deviceReadiness(env = globalThis) {
  const nav = env.navigator || {};
  const checks = [];

  checks.push(env.isSecureContext
    ? status('secure', 'Secure page (https)', 'ok', 'Motion sensors only work on secure pages.')
    : status('secure', 'Secure page (https)', 'fail', 'Open this page over https; browsers block motion sensors on insecure pages.'));

  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(String(nav.userAgent || ''));
  checks.push(mobile
    ? status('phone', 'Phone or tablet', 'ok', 'This looks like a handheld device.')
    : status('phone', 'Phone or tablet', 'warn', 'The drawing needs a phone you can tilt. A desktop browser has no motion sensors.'));

  const touch = 'ontouchstart' in env || Number(nav.maxTouchPoints) > 0;
  checks.push(touch ? status('touch', 'Touch screen', 'ok', 'Touch is available for holding the ink button.') : status('touch', 'Touch screen', 'warn', 'No touch input detected; you need to hold to ink.'));

  const hasOrientation = typeof env.DeviceOrientationEvent !== 'undefined';
  const hasMotion = typeof env.DeviceMotionEvent !== 'undefined';
  checks.push(hasOrientation
    ? status('orientation', 'Orientation sensor', 'ok', 'DeviceOrientation is supported.')
    : status('orientation', 'Orientation sensor', 'fail', 'This browser has no DeviceOrientation support — use Chrome or Safari on a phone.'));
  checks.push(hasMotion
    ? status('motion', 'Motion sensor', 'ok', 'DeviceMotion is supported.')
    : status('motion', 'Motion sensor', 'fail', 'This browser has no DeviceMotion support — use Chrome or Safari on a phone.'));

  const needsTap = typeof env.DeviceOrientationEvent?.requestPermission === 'function' || typeof env.DeviceMotionEvent?.requestPermission === 'function';
  if (needsTap) checks.push(status('permission', 'Sensor permission prompt', 'warn', 'This browser (iPhone/iPad) asks permission. Press “Allow sensors” below, then choose Allow.'));

  checks.push(nav.geolocation
    ? status('geo', 'Location', 'ok', 'Available. The exercise records location as part of its consented data, so allow it when asked.')
    : status('geo', 'Location', 'warn', 'No geolocation API found. The exercise may ask for location.'));

  checks.push('getBattery' in nav
    ? status('battery', 'Battery information', 'ok', 'Available (it is part of the recorded data).')
    : status('battery', 'Battery information', 'warn', 'Not exposed by this browser (common on iPhone); usually fine.'));

  const failed = checks.filter((c) => c.status === 'fail').length;
  const warned = checks.filter((c) => c.status === 'warn').length;
  return { checks, failed, warned, ready: failed === 0 && !!mobile };
}

/** Asks for the sensor permissions that need a user tap (iOS/iPadOS Safari). Resolves with a plain result. */
export async function requestSensorPermission(env = globalThis) {
  const asks = [env.DeviceOrientationEvent?.requestPermission, env.DeviceMotionEvent?.requestPermission].filter((fn) => typeof fn === 'function');
  if (asks.length === 0) return { ok: true, message: 'This browser does not need a permission tap.' };
  try {
    const answers = await Promise.all(asks.map((ask) => ask.call(env.DeviceOrientationEvent?.requestPermission === ask ? env.DeviceOrientationEvent : env.DeviceMotionEvent)));
    return answers.every((answer) => answer === 'granted')
      ? { ok: true, message: 'Sensor permission granted.' }
      : { ok: false, message: 'Permission was not granted. Reload the page, press Allow sensors again and choose Allow (in iOS: Settings → Safari → Motion & Orientation Access).' };
  } catch (error) {
    return { ok: false, message: `The browser refused the permission request (${error?.message || 'error'}). Press the button directly, on a secure page.` };
  }
}

/** Listens for orientation events for `ms` and reports whether the phone is really delivering and changing readings. */
export function sampleOrientation(env = globalThis, ms = 2500) {
  return new Promise((resolve) => {
    if (typeof env.addEventListener !== 'function') return resolve({ events: 0, moved: false, message: 'This environment cannot listen for orientation events.' });
    let events = 0;
    let min = { beta: Infinity, gamma: Infinity };
    let max = { beta: -Infinity, gamma: -Infinity };
    const handler = (event) => {
      if (event && event.beta != null && event.gamma != null) {
        events += 1;
        min = { beta: Math.min(min.beta, event.beta), gamma: Math.min(min.gamma, event.gamma) };
        max = { beta: Math.max(max.beta, event.beta), gamma: Math.max(max.gamma, event.gamma) };
      }
    };
    env.addEventListener('deviceorientation', handler);
    setTimeout(() => {
      env.removeEventListener?.('deviceorientation', handler);
      const spread = events ? Math.max(max.beta - min.beta, max.gamma - min.gamma) : 0;
      const moved = spread >= 8;
      resolve({
        events,
        moved,
        spread: Math.round(spread * 10) / 10,
        message: events === 0
          ? 'No orientation readings arrived. Allow sensors, use a phone, and make sure the page is on https.'
          : moved
            ? `Sensors work: ${events} readings and a ${Math.round(spread)}° change while you tilted.`
            : `${events} readings arrived but barely changed. Tilt the phone while this runs.`,
      });
    }, ms);
  });
}
