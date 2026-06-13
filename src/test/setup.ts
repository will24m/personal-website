import "@testing-library/jest-dom/vitest";

// jsdom lacks matchMedia; needed by useIsNarrowViewport, TypedSectionTitle, Framer Motion.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// jsdom in this environment does not expose a functional Storage; provide one.
function createStorageStub(): Storage {
  let store: Record<string, string> = {};
  return {
    get length() {
      return Object.keys(store).length;
    },
    clear() {
      store = {};
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    key(index: number) {
      return Object.keys(store)[index] ?? null;
    },
    removeItem(key: string) {
      delete store[key];
    },
    setItem(key: string, value: string) {
      store[key] = String(value);
    },
  } as Storage;
}

if (typeof window !== "undefined") {
  if (typeof window.localStorage?.clear !== "function") {
    Object.defineProperty(window, "localStorage", {
      value: createStorageStub(),
      configurable: true,
    });
  }
  if (typeof window.sessionStorage?.clear !== "function") {
    Object.defineProperty(window, "sessionStorage", {
      value: createStorageStub(),
      configurable: true,
    });
  }
}

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): unknown[] {
    return [];
  }
}

if (typeof window !== "undefined") {
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = ObserverStub as unknown as typeof IntersectionObserver;
  }
  if (!window.ResizeObserver) {
    window.ResizeObserver = ObserverStub as unknown as typeof ResizeObserver;
  }
}
