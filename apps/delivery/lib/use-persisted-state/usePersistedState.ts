import { useState, useEffect, useRef, useCallback } from "react";
import useEventListener from "@use-it/event-listener";

import { createGlobalState } from "./createGlobalState";

type StorageProvider = {
  get(key: string, defaultValue: any): any;
  set(key: string, value: any): void;
};

export const usePersistedState = <T>(
  initialState: T,
  key: string,
  { get, set }: StorageProvider,
): [T, (newState: T | ((prevState: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => get(key, initialState));
  const globalState = useRef(createGlobalState(key, setState, initialState));

  // subscribe to `storage` change events
  // @ts-ignore
  useEventListener("storage", ({ key: k, newValue }) => {
    if (k === key) {
      const newState = JSON.parse(newValue!);
      if (state !== newState) {
        setState(newState);
      }
    }
  });

  // only called on mount
  useEffect(() => {
    globalState.current = createGlobalState(key, setState, initialState);

    return () => {
      globalState.current.deregister();
    };
  }, [initialState, key]);

  const persistentSetState = useCallback(
    (newState: T | ((prevState: T) => T)) => {
      const newStateValue = typeof newState === "function" ? (newState as (prevState: T) => T)(state) : newState;

      // persist to localStorage
      set(key, newStateValue);

      setState(newStateValue);

      // inform all of the other instances in this tab
      globalState.current.emit(newStateValue);
    },
    [state, set, key],
  );

  return [state as T, persistentSetState];
};
