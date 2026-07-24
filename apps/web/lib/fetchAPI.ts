import { Session } from "@/types/session";
import { mockRequest } from "@/lib/mocks/router";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

/**
 * Sends a request to the specified URL with the provided options and user credentials
 *
 * @param {string} url - The URL to send the request to
 * @param {Object} options - The options to use for the request
 * @param {Object} user - The user credentials to use for the request
 * @param {string?} toastID - The ID of the toast to display while the request is being sent (optional)
 *
 * @returns {Promise<Response>} - A promise that resolves with the response if the request is successful, or rejects with the response if the request fails
 */
export const fetchAPI = async (
  url: string,
  token: Session["token"] | null | undefined = "",
  options?: RequestInit,
): Promise<Response> => {
  // Serves fixed French fixtures from lib/mocks instead of calling services/gateway-mock over HTTP,
  // so the front can run standalone. Toggle with NEXT_PUBLIC_USE_MOCKS.
  if (USE_MOCKS) return mockRequest(url, token, options);

  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
  // Throw an error if the API URL is not defined
  if (!API_URL) throw new Error("API URL is not provided");

  // // Throw an error if the user is not defined
  // if (!token) throw new Error("Token is not provided");

  // Send the request to the specified URL with the provided options and user credentials
  return fetch(API_URL + url, {
    headers: {
      ...(token !== "" ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
};
