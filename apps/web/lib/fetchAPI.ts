import { Session } from "@/types/session";

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
export const fetchAPI = async (url: string, token: Session["token"] = "", options?: RequestInit): Promise<Response> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
  // Throw an error if the API URL is not defined
  if (!API_URL) throw new Error("API URL is not provided");

  // Throw an error if the user is not defined
  if (!token) throw new Error("Token is not provided");

  // Send the request to the specified URL with the provided options and user credentials
  return fetch(API_URL + url, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })
    .then((res) => {
      // If the response is successful, resolve the promise with the response
      if (res.ok) return Promise.resolve(res);
      // Otherwise, reject the promise with the response
      else return Promise.reject(res);
    })
    .catch(Promise.reject);
};
