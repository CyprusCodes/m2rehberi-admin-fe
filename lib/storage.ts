export const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

export const SetStorage = <T = unknown>(key: string, value: T) => {
  if (!isBrowser()) return;
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
  } catch (_) {
    // swallow
  }
};

export const GetStorage = <T = unknown>(key: string): T | null => {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return null;
    return JSON.parse(raw) as T;
  } catch (_) {
    return null;
  }
};

export const RemoveStorage = (key: string) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch (_) {
    // swallow
  }
};

const AUTH_TOKEN_KEY = "authToken";
const USER_KEY = "metinport_user";

export const setAuthToken = (token: string) => SetStorage(AUTH_TOKEN_KEY, token);
export const getAuthToken = (): string | null => GetStorage<string>(AUTH_TOKEN_KEY);
export const removeAuthToken = () => RemoveStorage(AUTH_TOKEN_KEY);

export const setUser = <T = unknown>(user: T) => SetStorage<T>(USER_KEY, user);
export const getUser = <T = unknown>(): T | null => GetStorage<T>(USER_KEY);
export const removeUser = () => RemoveStorage(USER_KEY);


