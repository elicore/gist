import type {
  Gist,
  CreateGistRequest,
  UpdateGistRequest,
  GitHubAPIError as GitHubAPIErrorType
} from './types.js';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Custom error class for GitHub API errors
 */
export class GitHubAPIError extends Error implements GitHubAPIErrorType {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

/**
 * GitHub Gist API client
 * Provides methods to interact with GitHub's Gist API
 */
export class GitHubGistAPI {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  /**
   * Make a request to the GitHub API
   */
  private async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${GITHUB_API_BASE}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new GitHubAPIError(
        `GitHub API error: ${response.status} ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get all gists for the authenticated user
   */
  async getAllGists(): Promise<Gist[]> {
    return this.request<Gist[]>('/gists');
  }

  /**
   * Get a specific gist by ID
   */
  async getGist(id: string): Promise<Gist> {
    return this.request<Gist>(`/gists/${id}`);
  }

  /**
   * Create a new gist
   */
  async createGist(gist: CreateGistRequest): Promise<Gist> {
    return this.request<Gist>('/gists', {
      method: 'POST',
      body: JSON.stringify(gist),
    });
  }

  /**
   * Update an existing gist
   */
  async updateGist(id: string, gist: UpdateGistRequest): Promise<Gist> {
    return this.request<Gist>(`/gists/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(gist),
    });
  }

  /**
   * Delete a gist
   */
  async deleteGist(id: string): Promise<void> {
    await this.request<void>(`/gists/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Star a gist
   */
  async starGist(id: string): Promise<void> {
    await this.request<void>(`/gists/${id}/star`, {
      method: 'PUT',
    });
  }

  /**
   * Unstar a gist
   */
  async unstarGist(id: string): Promise<void> {
    await this.request<void>(`/gists/${id}/star`, {
      method: 'DELETE',
    });
  }

  /**
   * Check if a gist is starred
   */
  async isGistStarred(id: string): Promise<boolean> {
    try {
      await this.request<void>(`/gists/${id}/star`);
      return true;
    } catch (error) {
      if (error instanceof GitHubAPIError && error.status === 404) {
        return false;
      }
      throw error;
    }
  }
}
