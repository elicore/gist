const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubGistAPI {
  constructor(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${GITHUB_API_BASE}${endpoint}`;
    const config = {
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
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAllGists() {
    return this.request('/gists');
  }

  async getGist(id) {
    return this.request(`/gists/${id}`);
  }

  async createGist(gist) {
    return this.request('/gists', {
      method: 'POST',
      body: JSON.stringify(gist),
    });
  }

  async updateGist(id, gist) {
    return this.request(`/gists/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(gist),
    });
  }

  async deleteGist(id) {
    return this.request(`/gists/${id}`, {
      method: 'DELETE',
    });
  }

  async starGist(id) {
    return this.request(`/gists/${id}/star`, {
      method: 'PUT',
    });
  }

  async unstarGist(id) {
    return this.request(`/gists/${id}/star`, {
      method: 'DELETE',
    });
  }

  async isGistStarred(id) {
    try {
      await this.request(`/gists/${id}/star`);
      return true;
    } catch (error) {
      if (error.message.includes('404')) {
        return false;
      }
      throw error;
    }
  }
}