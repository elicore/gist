# Gist Manager

A modern desktop application built with Tauri 2.0 and Svelte for managing your GitHub Gists with a beautiful, responsive interface.

## Features

- 🔐 **Secure GitHub Integration** - Connect with your GitHub personal access token
- 📋 **Gist Management** - View, search, and organize all your gists
- 📝 **Rich Code Editor** - Monaco Editor with syntax highlighting for 50+ languages
- 🎨 **Modern UI** - Clean design with smooth animations using shadcn-svelte components
- 🗂️ **File Type Icons** - Visual file type indicators for better organization
- ⚡ **Fast Performance** - Native desktop performance with Tauri
- 🔄 **Real-time Sync** - Create, edit, and delete files with instant GitHub sync

## Setup

1. **Clone and install dependencies:**

   ```bash
   cd gist-manager
   npm install
   ```

2. **Run in development mode:**

   ```bash
   npm run tauri:dev
   ```

3. **Build for production:**

   ```bash
   npm run tauri:build
   ```

## GitHub Token Setup

To use this application, you'll need a GitHub Personal Access Token:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `gist` scope
3. Copy the token and paste it in the app when prompted

**Note:** Your token is stored locally and never sent anywhere except to GitHub's API.

## Usage

1. **Connect to GitHub** - Enter your personal access token
2. **Browse Gists** - View all your gists in the left panel with search functionality
3. **Select & Edit** - Click on any gist to view its files
4. **Rich Editing** - Use the Monaco editor with full syntax highlighting
5. **File Management** - Add new files, edit existing ones, or delete files
6. **Auto-save** - Changes are automatically synced to GitHub

## Tech Stack

- **Frontend:** Svelte 4 + TypeScript
- **Backend:** Tauri 2.0 (Rust)
- **UI Components:** shadcn-svelte + Tailwind CSS
- **Editor:** Monaco Editor
- **Icons:** Lucide Svelte
- **Build Tool:** Vite

## Development

The application is structured as follows:

- `src/lib/github.js` - GitHub API integration
- `src/lib/stores.js` - Svelte stores for state management
- `src/lib/components/` - Reusable UI components
- `src/lib/file-icons.js` - File type icon mapping
- `src-tauri/` - Tauri backend configuration

## License

MIT
