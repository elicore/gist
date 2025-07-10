// Shared type definitions for the Gist Manager application

// GitHub API Types
export interface GistFile {
  filename?: string;
  content: string;
  language?: string | null;
  raw_url?: string;
  size?: number;
  truncated?: boolean;
  type?: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url?: string;
  url?: string;
  html_url?: string;
}

export interface Gist {
  id: string;
  description: string | null;
  public: boolean;
  files: Record<string, GistFile>;
  created_at: string;
  updated_at: string;
  html_url: string;
  git_pull_url: string;
  git_push_url: string;
  owner?: GitHubUser;
  comments?: number;
  comments_url?: string;
  forks?: Gist[];
  history?: GistHistory[];
}

export interface GistHistory {
  version: string;
  committed_at: string;
  change_status: {
    total: number;
    additions: number;
    deletions: number;
  };
  url: string;
}

export interface CreateGistRequest {
  description: string;
  public: boolean;
  files: Record<string, { content: string }>;
}

export interface UpdateGistRequest {
  description?: string;
  files?: Record<string, { content: string } | null>;
}

// File Icon Types
export interface FileIconConfig {
  text: string;
  lightBg: string;
  darkBg: string;
  lightText: string;
  darkText: string;
  isCustom: boolean;
}

// Theme Types
export type ThemeMode = 'system' | 'light' | 'dark';
export type EditorTheme = string;

// Selected File Type (for internal state management)
export interface SelectedFile {
  filename: string;
  content: string;
  language?: string | null;
}

// Store Data Types
export interface StoreData {
  gists: Gist[];
  selectedGist: Gist | null;
  selectedFile: SelectedFile | null;
  isLoading: boolean;
  error: string | null;
  githubToken: string;
  theme: ThemeMode;
  lightEditorTheme: EditorTheme;
  darkEditorTheme: EditorTheme;
}

// API Error Types
export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

// Monaco Editor Theme Configuration
export interface MonacoThemeRule {
  token: string;
  foreground: string;
  background?: string;
  fontStyle?: string;
}

export interface MonacoThemeColors {
  [key: string]: string;
}

export interface MonacoThemeConfig {
  base: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light';
  inherit: boolean;
  rules: MonacoThemeRule[];
  colors: MonacoThemeColors;
}
