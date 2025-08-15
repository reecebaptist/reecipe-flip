// Simple global loader with reference counting and event dispatching.
// Use showLoader() before an async operation and hideLoader() in finally.

type Listener = (activeCount: number) => void;

let count = 0;
const listeners = new Set<Listener>();

export function getLoaderCount() {
  return count;
}

export function showLoader() {
  count += 1;
  emit();
}

export function hideLoader() {
  count = Math.max(0, count - 1);
  emit();
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  // Immediately notify with current state
  listener(count);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((l) => l(count));
  try {
    if (typeof window !== 'undefined' && typeof (window as any).dispatchEvent === 'function') {
      // Also dispatch a DOM event for non-React consumers if needed
      const ev = new CustomEvent('global-loader', { detail: { count } });
      window.dispatchEvent(ev);
    }
  } catch {
    // ignore
  }
}

export function withLoader<T>(fn: () => Promise<T>): Promise<T> {
  showLoader();
  return fn().finally(hideLoader);
}
