import React from "react";
import { subscribe, getLoaderCount } from "../lib/loader";

/**
 * GlobalLoader renders a full-screen overlay spinner whenever
 * the global loader count is > 0. It uses styles defined in styles.css
 * (.loading-overlay and .loading-spinner).
 */
export default function GlobalLoader() {
  const [count, setCount] = React.useState<number>(() => getLoaderCount());

  React.useEffect(() => {
    const unsub = subscribe(setCount);
    return () => {
      unsub();
    };
  }, []);

  if (count <= 0) return null;
  return (
    <div className="loading-overlay" aria-live="polite" aria-busy="true">
      <div className="loading-spinner" />
    </div>
  );
}
