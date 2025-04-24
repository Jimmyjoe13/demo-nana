// Simple encryption/decryption for API key
// Note: This is not meant to be secure, just to obscure the API key in localStorage

export function encryptApiKey(apiKey: string): string {
  return btoa(apiKey);
}

export function decryptApiKey(encryptedApiKey: string): string {
  try {
    return atob(encryptedApiKey);
  } catch (error) {
    console.error("Error decrypting API key:", error);
    return "";
  }
}

// Local storage utility functions
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
}

export function setToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}
