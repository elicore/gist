<script>
  import { onMount } from 'svelte';
  import { selectedGist, selectedFile, githubToken, isLoading, theme } from '../stores.js';
  import { GitHubGistAPI } from '../github.js';
  import { getFileIcon } from '../file-icons.js';
  import { Plus, Save, Trash2, Edit3, Code, FileText, Eye, EyeOff, Palette } from 'lucide-svelte';
  import Button from './Button.svelte';
  import Input from './Input.svelte';
  import Card from './Card.svelte';
  import { marked } from 'marked';
  import loader from '@monaco-editor/loader';
  import { initMonaco, createEditor, setEditorTheme, getLanguageFromFilename } from '../monaco.js';

  let editorContainer = $state();
  let monaco = $state();
  let editor = $state();
  let api = $state();
  let isEditing = $state(false);
  let newFileName = $state('');
  let showNewFileInput = $state(false);
  let monacoReady = $state(false);
  let showMarkdownPreview = $state(false);
  let initializingMonaco = $state(false);
  let showThemeMenu = $state(false);
  let themeButtonRef = $state();
  let themeButtonPosition = $state();
  
  // Available editor themes
  const editorThemes = [
    { key: 'custom-light', name: 'Light', group: 'light' },
    { key: 'custom-dark', name: 'Dark', group: 'dark' },
    { key: 'vs', name: 'VS Code Light', group: 'light' },
    { key: 'vs-dark', name: 'VS Code Dark', group: 'dark' },
    { key: 'hc-black', name: 'High Contrast Dark', group: 'dark' },
    { key: 'hc-light', name: 'High Contrast Light', group: 'light' }
  ];
  
  let currentEditorTheme = $state('auto'); // 'auto' follows app theme
  
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

  // Update editor theme when app theme changes
  $effect(() => {
    if (editor && monacoReady) {
      applyEditorTheme();
    }
  });
  
  function applyEditorTheme() {
    if (!editor || !monacoReady) return;
    
    let themeToApply;
    
    if (currentEditorTheme === 'auto') {
      // Follow app theme
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeToApply = isDark ? 'custom-dark' : 'custom-light';
    } else {
      // Use specific theme
      themeToApply = currentEditorTheme;
    }
    
    try {
      monaco.editor.setTheme(themeToApply);
      console.log('Applied editor theme:', themeToApply);
    } catch (error) {
      console.error('Failed to apply editor theme:', error);
    }
  }
  
  function toggleThemeMenu() {
    if (!showThemeMenu && themeButtonRef) {
      const rect = themeButtonRef.getBoundingClientRect();
      themeButtonPosition = {
        bottom: rect.bottom + 4,
        right: rect.right
      };
    }
    showThemeMenu = !showThemeMenu;
  }
  
  function selectEditorTheme(theme) {
    currentEditorTheme = theme;
    applyEditorTheme();
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
      
      // Determine theme
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const theme = isDark ? 'custom-dark' : 'custom-light';
      
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

  function showNewFile() {
    showNewFileInput = true;
    newFileName = '';
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
      
      showNewFileInput = false;
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
            <p class="text-xs text-muted-foreground">
              {Object.keys($selectedGist.files || {}).length} file{Object.keys($selectedGist.files || {}).length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onclick={showNewFile} class="transition-all duration-200 hover:scale-105">
          <Plus size={16} />
          New File
        </Button>
      </div>

      {#if showNewFileInput}
        <div class="flex gap-2 mb-4">
          <Input
            placeholder="filename.ext"
            bind:value={newFileName}
            onkeydown={(e) => e.key === 'Enter' && createNewFile()}
          />
          <Button size="sm" onclick={createNewFile}>Add</Button>
          <Button variant="outline" size="sm" onclick={() => showNewFileInput = false}>
            Cancel
          </Button>
        </div>
      {/if}

      <div class="flex flex-wrap gap-2">
        {#each Object.entries($selectedGist.files || {}) as [filename, file]}
          {@const IconComponent = getFileIcon(filename)}
          <button
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105 hover:translate-y-[-1px] active:scale-95 {$selectedFile?.filename === filename ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-secondary/80 hover:bg-secondary text-secondary-foreground'}"
            onclick={() => selectFile(filename)}
          >
            <IconComponent size={14} />
            <span class="truncate max-w-32">{filename}</span>
          </button>
        {/each}
      </div>
    </div>

    {#if $selectedFile}
      {@const IconComponent = getFileIcon($selectedFile.filename)}
      <div class="border-b border-border/50 p-4 bg-card/20 backdrop-blur-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-accent/50 rounded-md flex items-center justify-center">
              <IconComponent size={16} />
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
                class="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border border-border bg-card hover:bg-accent transition-all duration-200 hover:scale-105"
                title="Editor theme"
              >
                <Palette size={14} />
                <span>{currentEditorTheme === 'auto' ? 'Auto' : editorThemes.find(t => t.key === currentEditorTheme)?.name || 'Theme'}</span>
              </button>
            </div>
            
            {#if isEditing}
              <Button size="sm" onclick={saveFile} class="transition-all duration-200 hover:scale-105">
                <Save size={16} />
                Save
              </Button>
              <Button variant="outline" size="sm" onclick={cancelEditing}>
                Cancel
              </Button>
            {:else}
              <Button variant="outline" size="sm" onclick={startEditing} class="transition-all duration-200 hover:scale-105">
                <Edit3 size={16} />
                Edit
              </Button>
            {/if}
            <Button variant="destructive" size="sm" onclick={deleteFile} class="transition-all duration-200 hover:scale-105">
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div class="flex-1 relative bg-background/50">
        {#if showMarkdownPreview && isMarkdownFile}
          <div class="w-full h-full p-6 overflow-y-auto bg-card/50 backdrop-blur-sm">
            <div class="prose prose-sm max-w-none dark:prose-invert">
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
  <div class="fixed inset-0 z-[9999]" onclick={() => showThemeMenu = false}>
    <div 
      class="absolute bg-card border border-border rounded-lg shadow-xl min-w-48 py-1"
      style="top: {themeButtonPosition?.bottom || 0}px; right: {window.innerWidth - (themeButtonPosition?.right || 0)}px;"
      onclick={(e) => e.stopPropagation()}
    >
      <button
        onclick={() => selectEditorTheme('auto')}
        class="w-full px-3 py-2 text-left text-xs hover:bg-accent transition-colors {currentEditorTheme === 'auto' ? 'bg-primary/10 text-primary' : ''}"
      >
        Auto (Follow App Theme)
      </button>
      <div class="border-t border-border my-1"></div>
      {#each editorThemes as theme}
        <button
          onclick={() => selectEditorTheme(theme.key)}
          class="w-full px-3 py-2 text-left text-xs hover:bg-accent transition-colors {currentEditorTheme === theme.key ? 'bg-primary/10 text-primary' : ''}"
        >
          {theme.name}
        </button>
      {/each}
    </div>
  </div>
{/if}