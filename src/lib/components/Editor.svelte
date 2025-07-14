<script>
  import { selectedGist, selectedFile, githubToken, isLoading, lightEditorTheme, darkEditorTheme } from '../stores.ts';
  import { GitHubGistAPI } from '../github.ts';
  import FileIcon from './FileIcon.svelte';
  import { Plus, Save, Trash2, Edit3, Code, FileText, Eye, Palette, Globe, Lock, Calendar } from 'lucide-svelte';
  import { marked } from 'marked';
  import loader from '@monaco-editor/loader';
  import { initMonaco, createEditor, getLanguageFromFilename } from '../monaco.ts';

  let editorContainer = $state();
  let monaco = $state();
  let editor = $state();
  let api = $state();
  let isEditing = $state(false);
  let newFileName = $state('');
  let editingNewFile = $state(false);
  let newFileInputRef = $state();
  let monacoReady = $state(false);
  let showMarkdownPreview = $state(false);
  let initializingMonaco = $state(false);
  let showThemeMenu = $state(false);
  let themeButtonRef = $state();
  let themeButtonPosition = $state();

  // Available editor themes (only include themes that are actually defined in monaco.js)
  const editorThemes = [
    // Light themes
    { key: 'github-light', name: 'GitHub Light' },
    { key: 'light-plus', name: 'Light+' },
    { key: 'atom-one-light', name: 'Atom One Light' },
    { key: 'quiet-light', name: 'Quiet Light' },
    { key: 'winter-light', name: 'Winter Light' },
    { key: 'solarized-light', name: 'Solarized Light' },
    { key: 'custom-light', name: 'Custom Light' },
    { key: 'vs', name: 'VS Light' },
    { key: 'hc-light', name: 'HC Light' },
    // Dark themes
    { key: 'github-dark', name: 'GitHub Dark' },
    { key: 'one-dark-pro', name: 'One Dark Pro' },
    { key: 'monokai', name: 'Monokai' },
    { key: 'dracula', name: 'Dracula' },
    { key: 'night-owl', name: 'Night Owl' },
    { key: 'ayu-dark', name: 'Ayu Dark' },
    { key: 'material-theme', name: 'Material' },
    { key: 'cobalt2', name: 'Cobalt2' },
    { key: 'solarized-dark', name: 'Solarized Dark' },
    { key: 'custom-dark', name: 'Custom Dark' },
    { key: 'vs-dark', name: 'VS Dark' },
    { key: 'hc-black', name: 'HC Dark' }
  ];


  // Check if current file is markdown
  let isMarkdownFile = $derived($selectedFile && $selectedFile.filename.toLowerCase().match(/\.(md|markdown)$/));

  // Generate markdown preview
  let markdownPreview = $derived(
    isMarkdownFile && $selectedFile
      ? marked($selectedFile.content || '')
      : ''
  );

  $effect(() => {
    if ($githubToken) {
      api = new GitHubGistAPI($githubToken);
    }
  });

  $effect(() => {
    if ($selectedGist) {
      console.log('Editor: selectedGist updated:', $selectedGist);
    }
  });

  $effect(() => {
    if ($selectedFile) {
      console.log('Editor: selectedFile updated:', $selectedFile);
    }
  });

  // Watch for file changes and update editor content
  $effect(() => {
    if ($selectedFile && editor && monacoReady) {
      console.log('Editor: updating editor content due to file change');
      updateEditorContent();
    }
  });

  // Initialize Monaco Editor when container is available
  $effect(() => {
    if (editorContainer && !editor && !initializingMonaco) {
      initializeMonaco();
    }
  });

  // State to track current theme
  let currentTheme = $state();

  // Function to get the current editor theme based on mode
  function getCurrentEditorTheme() {
    if (typeof document === 'undefined') return $lightEditorTheme; // SSR safety
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? $darkEditorTheme : $lightEditorTheme;
  }

  // Initialize current theme and update when stores change
  $effect(() => {
    // Small delay to ensure document theme is applied
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        currentTheme = getCurrentEditorTheme();
      }, 100);
    }
  });

  // Apply the appropriate theme when editor is ready or theme changes
  $effect(() => {
    if (editor && monacoReady && currentTheme) {
      try {
        monaco.editor.setTheme(currentTheme);
      } catch (error) {
        console.error('Failed to apply editor theme:', error);
      }
    }
  });

  // Watch for theme changes in the document
  $effect(() => {
    if (editor && monacoReady) {
      const observer = new MutationObserver(() => {
        const newTheme = getCurrentEditorTheme();
        currentTheme = newTheme;
        try {
          monaco.editor.setTheme(newTheme);
        } catch (error) {
          console.error('Failed to apply editor theme:', error);
        }
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });

      return () => observer.disconnect();
    }
  });

  function toggleThemeMenu() {
    if (!showThemeMenu && themeButtonRef) {
      const rect = themeButtonRef.getBoundingClientRect();
      themeButtonPosition = {
        top: rect.bottom + 4,
        left: rect.left
      };
    }
    showThemeMenu = !showThemeMenu;
  }

  function selectEditorTheme(theme) {
    // Save to the appropriate store based on current mode
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
      darkEditorTheme.set(theme);
    } else {
      lightEditorTheme.set(theme);
    }

    // Update current theme state
    currentTheme = theme;

    // Apply the theme immediately
    try {
      monaco.editor.setTheme(theme);
    } catch (error) {
      console.error('Failed to apply editor theme:', error);
    }

    showThemeMenu = false;
  }

  $effect(() => {
    if (editor) {
      console.log('Updating editor readonly state:', !isEditing);
      editor.updateOptions({ readOnly: !isEditing });
    }
  });

  async function initializeMonaco() {
    if (initializingMonaco) return;
    initializingMonaco = true;

    try {
      console.log('Starting Monaco initialization...');

      // Initialize Monaco instance
      monaco = await loader.init();

      // Ensure our custom themes are available
      await initMonaco();

      // Use the appropriate theme for the current mode - wait a bit for document theme to be applied
      await new Promise(resolve => setTimeout(resolve, 50));
      const theme = getCurrentEditorTheme();

      // Create the editor
      editor = createEditor(editorContainer, {
        value: $selectedFile?.content || '',
        language: getLanguageFromFilename($selectedFile?.filename || 'untitled.txt'),
        theme: theme,
        readOnly: !isEditing
      });

      // Listen for content changes
      editor.onDidChangeModelContent(() => {
        if (isEditing && $selectedFile) {
          $selectedFile.content = editor.getValue();
        }
      });

      monacoReady = true;

      // Ensure we apply the correct theme immediately after initialization
      const correctTheme = getCurrentEditorTheme();
      currentTheme = correctTheme;
      try {
        monaco.editor.setTheme(correctTheme);
      } catch (error) {
        console.error('Failed to apply initial theme:', error);
      }

      console.log('Monaco Editor initialized successfully');

    } catch (error) {
      console.error('Failed to initialize Monaco Editor:', error);

      // Fallback to textarea
      const textarea = document.createElement('textarea');
      textarea.style.width = '100%';
      textarea.style.height = '100%';
      textarea.style.fontFamily = 'JetBrains Mono, monospace';
      textarea.style.fontSize = '14px';
      textarea.style.padding = '12px';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.backgroundColor = 'transparent';
      textarea.value = $selectedFile?.content || '';
      textarea.readOnly = !isEditing;

      textarea.addEventListener('input', (e) => {
        if (isEditing && $selectedFile) {
          $selectedFile.content = e.target.value;
        }
      });

      editorContainer.appendChild(textarea);
      monacoReady = true;

    } finally {
      initializingMonaco = false;
    }
  }

  async function updateEditorContent() {
    if (!$selectedFile || !editor || !monacoReady) {
      console.log('Missing dependencies for editor update');
      return;
    }

    try {
      const content = $selectedFile.content || '';
      const language = getLanguageFromFilename($selectedFile.filename);

      console.log('Updating editor with:', {
        filename: $selectedFile.filename,
        contentLength: content.length,
        language
      });

      // Update content and language
      editor.setValue(content);

      // Set language model
      const model = editor.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }

      console.log('Editor content updated successfully');
    } catch (error) {
      console.error('Error updating editor content:', error);
    }
  }


  function selectFile(filename) {
    if ($selectedGist && $selectedGist.files[filename]) {
      $selectedFile = {
        filename,
        content: $selectedGist.files[filename].content,
        language: $selectedGist.files[filename].language
      };
      isEditing = false;
      showMarkdownPreview = false; // Reset preview mode when switching files
    }
  }

  function startEditing() {
    console.log('Starting edit mode');
    isEditing = true;
    if (editor) {
      editor.updateOptions({ readOnly: false });
    }
  }

  function cancelEditing() {
    console.log('Cancelling edit mode');
    isEditing = false;
    // Reset the editor content to the original file content
    if (editor && $selectedFile) {
      updateEditorContent();
    }
  }

  async function saveFile() {
    if (!$selectedGist || !$selectedFile || !api) return;

    try {
      const updatedGist = {
        files: {
          [$selectedFile.filename]: {
            content: $selectedFile.content
          }
        }
      };

      await api.updateGist($selectedGist.id, updatedGist);

      // Update local state
      $selectedGist.files[$selectedFile.filename].content = $selectedFile.content;
      $selectedGist = { ...$selectedGist };

      isEditing = false;
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }

  async function deleteFile() {
    if (!$selectedGist || !$selectedFile || !api) return;

    try {
      const updatedGist = {
        files: {
          [$selectedFile.filename]: null
        }
      };

      await api.updateGist($selectedGist.id, updatedGist);

      // Update local state
      delete $selectedGist.files[$selectedFile.filename];
      $selectedGist = { ...$selectedGist };
      $selectedFile = null;

    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  function startNewFile() {
    editingNewFile = true;
    newFileName = 'untitled';
    // Focus the input after it's rendered
    setTimeout(() => {
      if (newFileInputRef) {
        newFileInputRef.focus();
        newFileInputRef.select();
      }
    }, 0);
  }

  function cancelNewFile() {
    editingNewFile = false;
    newFileName = '';
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async function createNewFile() {
    if (!newFileName || !$selectedGist || !api) return;

    try {
      const updatedGist = {
        files: {
          [newFileName]: {
            content: ''
          }
        }
      };

      await api.updateGist($selectedGist.id, updatedGist);

      // Update local state
      $selectedGist.files[newFileName] = { content: '', language: null };
      $selectedGist = { ...$selectedGist };

      // Select the new file
      selectFile(newFileName);

      editingNewFile = false;
      newFileName = '';
    } catch (error) {
      console.error('Error creating file:', error);
    }
  }
</script>

<div class="h-full flex flex-col bg-gradient-to-b from-background to-background/95">
  {#if $selectedGist}
    <div class="border-b border-border/50 p-4 bg-card/30 backdrop-blur-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Code size={20} class="text-primary" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-foreground">
              {$selectedGist.description || 'Untitled Gist'}
            </h2>

            <!-- Gist Details -->
            <div class="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              <!-- Visibility Status -->
              <div class="flex items-center gap-1.5" title={$selectedGist.public ? 'Public gist' : 'Private gist'}>
                {#if $selectedGist.public}
                  <Globe size={12} />
                  <span>Public</span>
                {:else}
                  <Lock size={12} />
                  <span>Private</span>
                {/if}
              </div>

              <!-- File Count (only if > 1) -->
              {#if Object.keys($selectedGist.files || {}).length > 1}
                <div class="flex items-center gap-1.5">
                  <FileText size={12} />
                  <span>{Object.keys($selectedGist.files || {}).length} files</span>
                </div>
              {/if}

              <!-- Created Date -->
              {#if $selectedGist.created_at}
                <div class="flex items-center gap-1.5" title="Created: {formatDate($selectedGist.created_at)}">
                  <Calendar size={12} />
                  <span>Created {formatDate($selectedGist.created_at)}</span>
                </div>
              {/if}

              <!-- Updated Date (only if different from created) -->
              {#if $selectedGist.updated_at && $selectedGist.updated_at !== $selectedGist.created_at}
                <div class="flex items-center gap-1.5" title="Last updated: {formatDate($selectedGist.updated_at)}">
                  <Calendar size={12} />
                  <span>Updated {formatDate($selectedGist.updated_at)}</span>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>


      <div class="flex flex-wrap gap-2">
        {#each Object.entries($selectedGist.files || {}) as [filename, file]}
          <button
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105 hover:translate-y-[-1px] active:scale-95 {$selectedFile?.filename === filename ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-secondary/80 hover:bg-secondary text-secondary-foreground'}"
            onclick={() => selectFile(filename)}
          >
            <FileIcon filename={filename} size={14} />
            <span class="truncate max-w-32">{filename}</span>
          </button>
        {/each}

        <!-- New file creation -->
        {#if editingNewFile}
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-secondary/80 border-2 border-primary/50">
            <FileText size={14} />
            <input
              bind:this={newFileInputRef}
              bind:value={newFileName}
              onkeydown={(e) => {
                if (e.key === 'Enter') createNewFile();
                if (e.key === 'Escape') cancelNewFile();
              }}
              onblur={createNewFile}
              class="bg-transparent outline-none border-none w-24 text-sm"
              placeholder="filename.ext"
            />
          </div>
        {:else}
          <button
            onclick={startNewFile}
            class="flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium bg-secondary/50 hover:bg-secondary border-2 border-dashed border-border hover:border-primary/50 transition-all duration-200 hover:scale-105"
            title="Add new file"
          >
            <Plus size={16} />
          </button>
        {/if}
      </div>
    </div>

    {#if $selectedFile}
      <div class="border-b border-border/50 p-4 bg-card/20 backdrop-blur-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-accent/50 rounded-md flex items-center justify-center">
              <FileIcon filename={$selectedFile.filename} size={16} />
            </div>
            <div>
              <span class="font-semibold text-foreground">{$selectedFile.filename}</span>
              <p class="text-xs text-muted-foreground">
                {isEditing ? 'Editing' : 'Read-only'}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            {#if isMarkdownFile}
              <button
                onclick={() => showMarkdownPreview = !showMarkdownPreview}
                class="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border border-border bg-card hover:bg-accent transition-all duration-200 hover:scale-105"
                title={showMarkdownPreview ? 'Show editor' : 'Show preview'}
              >
                {#if showMarkdownPreview}
                  <Code size={14} />
                  <span>Editor</span>
                {:else}
                  <Eye size={14} />
                  <span>Preview</span>
                {/if}
              </button>
            {/if}

            <!-- Editor Theme Selector -->
            <div class="relative">
              <button
                bind:this={themeButtonRef}
                onclick={toggleThemeMenu}
                class="flex items-center gap-1 px-2 py-1 text-xs rounded border border-border bg-card hover:bg-accent transition-colors"
                title="Editor theme: {currentTheme && editorThemes.find(t => t.key === currentTheme)?.name || 'Theme'}"
              >
                <Palette size={12} />
                <span class="text-[10px] font-mono">{(currentTheme && editorThemes.find(t => t.key === currentTheme)?.name || 'THEME').toUpperCase()}</span>
              </button>
            </div>

            {#if isEditing}
              <button
                onclick={saveFile}
                class="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105"
              >
                <Save size={14} />
                <span>Save</span>
              </button>
              <button
                onclick={cancelEditing}
                class="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border border-border bg-card hover:bg-accent transition-all duration-200 hover:scale-105"
              >
                <span>Cancel</span>
              </button>
            {:else}
              <button
                onclick={startEditing}
                class="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border border-border bg-card hover:bg-accent transition-all duration-200 hover:scale-105"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>
            {/if}
            <button
              onclick={deleteFile}
              class="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border border-border bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 hover:scale-105"
              title="Delete file"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <div class="flex-1 relative bg-background/50 overflow-hidden">
        {#if showMarkdownPreview && isMarkdownFile}
          <div class="w-full h-full overflow-y-auto scrollbar-custom bg-card/50 backdrop-blur-sm">
            <div class="p-6 markdown-preview max-w-none">
              {@html markdownPreview}
            </div>
          </div>
        {/if}

        <!-- Always render the editor container, just hide it when showing preview -->
        <div
          bind:this={editorContainer}
          class="w-full h-full absolute inset-0 rounded-lg overflow-hidden shadow-inner bg-background border border-border/50 {showMarkdownPreview && isMarkdownFile ? 'hidden' : ''}"
        >
          {#if initializingMonaco}
            <div class="w-full h-full flex items-center justify-center">
              <div class="text-center space-y-2">
                <div class="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p class="text-sm text-muted-foreground">Loading editor...</p>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div class="text-center space-y-4 p-8">
          <div class="w-20 h-20 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
            <FileText size={32} class="text-muted-foreground" />
          </div>
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-foreground">Select a file</h3>
            <p class="text-sm text-muted-foreground max-w-sm">
              Choose a file from the tabs above to view and edit its contents
            </p>
          </div>
        </div>
      </div>
    {/if}
  {:else}
    <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div class="text-center space-y-4 p-8">
        {#if $isLoading}
          <div class="w-12 h-12 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm text-muted-foreground">Loading gist...</p>
        {:else}
          <div class="w-20 h-20 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
            <Code size={32} class="text-muted-foreground" />
          </div>
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-foreground">Welcome to Gist Manager</h3>
            <p class="text-sm text-muted-foreground max-w-sm">
              Select a gist from the sidebar to start viewing and editing your code snippets
            </p>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<!-- Theme dropdown modal rendered at body level to avoid z-index issues -->
{#if showThemeMenu}
  <div class="fixed inset-0 z-[9999]" role="button" tabindex="0" onclick={() => showThemeMenu = false} onkeydown={(e)=>{ if(e.key==='Enter' || e.key===' ') showThemeMenu = false; }}>
    <div
      class="absolute bg-card border border-border rounded shadow-lg w-32 py-1 max-h-80 overflow-y-auto z-50"
      style="top: {themeButtonPosition?.top || 0}px; left: {themeButtonPosition?.left || 0}px;"
      role="menu" tabindex="0" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}
    >
      {#each editorThemes as theme}
        <button
          onclick={() => selectEditorTheme(theme.key)}
          class="w-full px-3 py-1.5 text-left text-xs hover:bg-accent transition-colors {currentTheme && currentTheme === theme.key ? 'bg-primary/10 text-primary' : ''}"
        >
          {theme.name}
        </button>
      {/each}
    </div>
  </div>
{/if}
