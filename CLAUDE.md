# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Gist Manager** is a desktop application built with Tauri 2.0 and Svelte 5 for managing GitHub Gists. It provides a Monaco Editor-based code editing experience with syntax highlighting and theme support.

## Technology Stack

- **Frontend**: Svelte 5 (with runes syntax), SvelteKit, TypeScript
- **Desktop**: Tauri 2.0 (Rust backend)
- **Editor**: Monaco Editor with custom themes
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build**: Vite, static adapter for SvelteKit

## Development Commands

```bash
# Start development environment (frontend + Tauri)
npm run tauri:dev

# Frontend development only
npm run dev

# Build production app
npm run tauri:build

# Type checking and validation
npm run check

# Watch mode for type checking
npm run check:watch
```

## Architecture

### Key Components Structure
- `src/lib/components/GistList.svelte` - Left sidebar for gist browsing
- `src/lib/components/Editor.svelte` - Monaco Editor integration with theme sync
- `src/lib/components/ThemeDropdown.svelte` - Theme switcher component
- `src/lib/github.js` - GitHub API client (GitHubGistAPI class)
- `src/lib/stores.js` - Svelte stores with localStorage persistence
- `src/lib/monaco.js` - Monaco Editor configuration and theme management

### State Management
Uses Svelte stores with localStorage backing for:
- `githubToken` - GitHub personal access token
- `gists` - Array of user's gists
- `selectedGist` - Currently selected gist
- `selectedFile` - Currently selected file within gist
- `theme` - Theme preference (light/dark/system)

### Monaco Editor Integration
- Custom themes: `custom-dark` and `custom-light` with VSCode-like syntax highlighting
- Language detection based on file extensions (50+ languages)
- Theme synchronization with app theme using MutationObserver
- Markdown preview functionality for .md files

### Theming System
- CSS custom properties in `src/app.css` for dynamic theming
- Theme switching via `[data-theme]` attribute on `<html>`
- Early theme initialization in `src/app.html` to prevent flash
- Tailwind CSS integration using `rgb(var(--color-*))` pattern

## Development Notes

### Svelte 5 Syntax
Project uses Svelte 5 runes syntax:
- `$state()` instead of `let` for reactive variables
- `$effect()` instead of `$:` for side effects
- `$derived()` for computed values
- `$props()` instead of `export let`

### Monaco Editor Setup
- Uses `@monaco-editor/loader` for proper initialization
- CDN fallback configured in `src/app.html`
- Custom themes defined in `src/lib/monaco.js`
- Worker configuration in `vite.config.js`

### GitHub Integration
- Requires GitHub Personal Access Token with `gist` scope
- Token stored in localStorage (frontend-only storage)
- Full CRUD operations: create, read, update, delete gists and files
- Real-time sync with GitHub API

### Build Configuration
- Static adapter for SvelteKit (`@sveltejs/adapter-static`)
- Outputs to `dist/` directory for Tauri consumption
- Tauri configured to serve from `../.svelte-kit/output/client`
- CSP disabled for Monaco Editor compatibility

## Common Issues

### Theme Not Working
- Check CSS custom properties are defined in `src/app.css`
- Ensure `[data-theme]` attribute is set on `<html>`
- Verify theme synchronization in Monaco Editor components

### Monaco Editor Issues
- Check if container element is properly bound with `bind:this`
- Ensure Monaco is initialized before creating editor
- Verify theme is set after Monaco instance creation

### Build Errors
- Clear `.svelte-kit` and `dist` directories if encountering cache issues
- Ensure all dependencies are installed: `npm install`
- Check Tauri configuration in `src-tauri/tauri.conf.json`

## File Structure Notes

- `src/app.css` - Global styles and CSS custom properties
- `src/app.html` - HTML template with theme initialization
- `src/routes/+layout.svelte` - Global layout wrapper
- `src/routes/+page.svelte` - Main application page
- `src-tauri/` - Tauri backend configuration (minimal custom code)
- `svelte.config.js` - SvelteKit configuration with static adapter
- `vite.config.js` - Vite configuration optimized for Tauri