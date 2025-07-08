import { writable } from 'svelte/store';

// Core gist management stores
export const gists = writable([]);
export const selectedGist = writable(null);
export const selectedFile = writable(null);
export const isLoading = writable(false);
export const error = writable(null);

// Settings stores with localStorage persistence
function createPersistentStore(key, defaultValue) {
  const store = writable(defaultValue);
  
  // Load from localStorage on creation
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      store.set(JSON.parse(saved));
    }
  }
  
  // Save to localStorage on changes
  store.subscribe(value => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });
  
  return store;
}

export const githubToken = createPersistentStore('github-token', '');
export const theme = createPersistentStore('gist-theme', 'system');
export const lightEditorTheme = createPersistentStore('gist-light-editor-theme', 'light-plus');
export const darkEditorTheme = createPersistentStore('gist-dark-editor-theme', 'github-dark');