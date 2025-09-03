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

export const setCookie = (name: string, value: string, days: number = 7) => {
  if (!isBrowser()) return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

// HERE change cookie "use server!"
export const getCookie = (name: string): string | null => {
  if (!isBrowser()) return null;
  
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    
    if (cookieName === name) {
      return cookieValue;
    }
  }
  
  return null;
};

export const removeCookie = (name: string) => {
  if (!isBrowser()) return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const setUser = <T = unknown>(user: T) => {
  SetStorage<T>(USER_KEY, user);  
  setCookie(USER_KEY, JSON.stringify(user));
};

export const getUser = <T = unknown>(): T | null => GetStorage<T>(USER_KEY);
export const removeUser = () => {
  RemoveStorage(USER_KEY);
  removeCookie(USER_KEY);
};