import { writable } from 'svelte/store';

export const githubToken = writable('');
export const gists = writable([]);
export const selectedGist = writable(null);
export const selectedFile = writable(null);
export const isLoading = writable(false);
export const error = writable(null);