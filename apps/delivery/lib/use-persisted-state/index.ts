import { useState } from "react";

import { usePersistedState } from "./usePersistedState";
import { createStorage } from "./createStorage";

const getProvider = (): Storage | null => {
  if (typeof global !== "undefined" && global.localStorage) return global.localStorage as Storage;
  // eslint-disable-next-line no-undef -- because we check for globalThis
  if (typeof globalThis !== "undefined" && globalThis.localStorage) return globalThis.localStorage as Storage;
  if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  if (typeof localStorage !== "undefined") return localStorage as Storage;

  return null;
};

/**
 * Creates a custom hook that returns a stateful value, and persists it to local storage.
 *
 * @remarks The hook is created using the `usePersistedState` hook, which takes an initial state value, a key to use for the local storage, and a storage object to use for the persistence. If no storage object is provided, the function attempts to use the global `localStorage` object.
 *
 * @param key - The key to use for the local storage.
 * @param provider - The storage object to use for the persistence. If not provided, the function attempts to use the global `localStorage` object.
 *
 * @returns A custom hook that returns a stateful value, and persists it to local storage.
 *
 * @example
 * const useTheme = createPersistedState("theme");
 * const [theme, setTheme] = useTheme("light");
 */
export const createPersistedState = <T>(key: string, provider = getProvider()) => {
  if (provider) {
    const storage = createStorage(provider);
    return (initialState: T) => usePersistedState(initialState, key, storage);
  }
  return useState;
};
