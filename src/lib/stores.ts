import { writable, type Writable } from 'svelte/store';
import type {
  Gist,
  SelectedFile,
  ThemeMode,
  EditorTheme
} from './types.js';

// Core gist management stores
export const gists: Writable<Gist[]> = writable([]);
export const selectedGist: Writable<Gist | null> = writable(null);
export const selectedFile: Writable<SelectedFile | null> = writable(null);
export const isLoading: Writable<boolean> = writable(false);
export const error: Writable<string | null> = writable(null);

/**
 * Creates a persistent store that syncs with localStorage
 * @param key - The localStorage key to use
 * @param defaultValue - The default value if no stored value exists
 * @returns A Svelte writable store that persists to localStorage
 */
function createPersistentStore<T>(key: string, defaultValue: T): Writable<T> {
  const store = writable<T>(defaultValue);

  // Load from localStorage on creation
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        store.set(JSON.parse(saved));
      }
    } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error);
      // If parsing fails, use default value
      store.set(defaultValue);
    }
  }

  // Save to localStorage on changes
  store.subscribe((value: T) => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Failed to save ${key} to localStorage:`, error);
      }
    }
  });

  return store;
}

// Settings stores with localStorage persistence
export const githubToken: Writable<string> = createPersistentStore('github-token', '');
export const theme: Writable<ThemeMode> = createPersistentStore('gist-theme', 'system');
export const lightEditorTheme: Writable<EditorTheme> = createPersistentStore('gist-light-editor-theme', 'light-plus');
export const darkEditorTheme: Writable<EditorTheme> = createPersistentStore('gist-dark-editor-theme', 'github-dark');
