import { fetchAPI } from "@/lib/fetchAPI";
import { Session } from "@/types/session";
import { useEffect, useReducer, useRef, useState } from "react";

interface State<T> {
  data?: T;
  error?: Error;
  loading: boolean;
  initialLoading: boolean;
  revalidate: () => void;
}

// type Cache<T> = { [url: string]: T };

// discriminated union type
type Action<T> = { type: "loading" } | { type: "fetched"; payload: T } | { type: "error"; payload: Error };

/**
 * It fetches data from a given url and stores it in a cache
 * @param {string} [propsURL] - The url to fetch data from.
 * @param {string} [token] - The session object to use for authentication.
 * @param {RequestInit} [options] - RequestInit
 * @returns The state object.
 */
export function useAPI<T = unknown>(
  propsURL: string,
  token: Session["token"] = "",
  options?: RequestInit & { noToast?: boolean },
): State<T> {
  const [url, setUrl] = useState(propsURL);
  // const cache = useRef<Cache<T>>({});

  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef<boolean>(false);

  const initialState: State<T> = {
    error: undefined,
    data: undefined,
    loading: true,
    initialLoading: true,
    revalidate: () => {
      return;
    },
  };
  const [data, setData] = useState<T | undefined>(undefined);
  const [revalidate, setRevalidate] = useState(false);

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "loading":
        return { ...initialState, loading: true };
      case "fetched":
        setData(action.payload);
        return {
          ...initialState,
          data: action.payload,
          loading: false,
          initialLoading: false,
          revalidate: () => setRevalidate(true),
        };
      case "error":
        return {
          ...initialState,
          error: action.payload,
          loading: false,
          initialLoading: false,
          revalidate: () => setRevalidate(true),
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    if (!propsURL) return;
    setUrl(propsURL);
  }, [propsURL]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "loading" });

      try {
        const response = await fetchAPI(url, token, options);
        if (!response.ok) throw new Error(response.statusText);

        const body = (await response.json()) as T;

        dispatch({ type: "fetched", payload: body });
        if (cancelRequest.current) return;
      } catch (error) {
        dispatch({ type: "error", payload: error as Error });
        if (cancelRequest.current) return;
      }
    };

    void fetchData();

    // Use the cleanup function for avoiding a possibly state update after the component was unmounted
    return () => {
      cancelRequest.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    if (revalidate === true) {
      setUrl(`${propsURL}${propsURL.includes("?") ? "&" : "?"}revalidate=${Date.now()}`);
      setRevalidate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revalidate]);

  return { ...state, data };
}