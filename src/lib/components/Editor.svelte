<script>
  import { onMount, afterUpdate } from 'svelte';
  import { selectedGist, selectedFile, githubToken, isLoading } from '../stores.js';
  import { GitHubGistAPI } from '../github.js';
  import { getFileIcon } from '../file-icons.js';
  import { Plus, Save, Trash2, Edit3 } from 'lucide-svelte';
  import Button from './Button.svelte';
  import Input from './Input.svelte';
  import Card from './Card.svelte';

  let editorContainer;
  let monaco;
  let editor;
  let api;
  let isEditing = false;
  let newFileName = '';
  let showNewFileInput = false;
  let monacoReady = false;

  $: if ($githubToken) {
    api = new GitHubGistAPI($githubToken);
  }

  $: if ($selectedGist) {
    console.log('Editor: selectedGist updated:', $selectedGist);
  }

  $: if ($selectedFile) {
    console.log('Editor: selectedFile updated:', $selectedFile);
  }

  // Use afterUpdate to ensure the editor is ready
  afterUpdate(() => {
    if ($selectedFile && editor && monaco && monacoReady) {
      console.log('Editor: updating editor content in afterUpdate');
      // Use setTimeout to ensure Monaco is fully ready
      setTimeout(() => {
        updateEditorContent();
      }, 50);
    }
  });

  $: if (editor) {
    console.log('Updating editor readonly state:', !isEditing);
    editor.updateOptions({ readOnly: !isEditing });
  }

  onMount(async () => {
    console.log('Editor onMount started');
    try {
      // Wait for the DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Editor container:', editorContainer);
      if (!editorContainer) {
        throw new Error('Editor container not found');
      }

      // Load Monaco Editor
      console.log('Loading Monaco Editor...');
      const monacoEditor = await import('monaco-editor');
      monaco = monacoEditor;
      console.log('Monaco Editor loaded successfully');
      
      console.log('Creating Monaco editor instance...');
      // Create editor instance with minimal configuration
      editor = monaco.editor.create(editorContainer, {
        value: '',
        language: 'plaintext',
        theme: 'vs-light',
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: 'on',
        tabSize: 2,
        insertSpaces: true,
        readOnly: true,
      });
      
      console.log('Monaco editor instance created:', editor);

    // Listen for content changes
    editor.onDidChangeModelContent(() => {
      if ($selectedFile && isEditing) {
        $selectedFile.content = editor.getValue();
      }
    });

      // Mark Monaco as ready
      monacoReady = true;
      console.log('Monaco editor initialized and ready');

      // If we have a selected file, update the content
      if ($selectedFile) {
        setTimeout(() => {
          updateEditorContent();
        }, 100);
      }
    } catch (error) {
      console.error('Error initializing Monaco Editor:', error);
    }
  });

  function updateEditorContent() {
    console.log('updateEditorContent called', { 
      selectedFile: $selectedFile?.filename, 
      content: $selectedFile?.content?.substring(0, 50) + '...', 
      editor: !!editor, 
      monaco: !!monaco, 
      monacoReady 
    });
    
    if (!$selectedFile || !editor || !monaco || !monacoReady) {
      console.log('Missing dependencies for editor update');
      return;
    }

    try {
      const language = getLanguageFromFilename($selectedFile.filename);
      const content = $selectedFile.content || '';
      console.log('Creating model with:', { filename: $selectedFile.filename, contentLength: content.length, language });
      
      // Dispose of the previous model to avoid memory leaks
      const currentModel = editor.getModel();
      if (currentModel) {
        currentModel.dispose();
      }
      
      const model = monaco.editor.createModel(content, language);
      editor.setModel(model);
      
      // Force a layout update
      editor.layout();
      
      console.log('Editor model updated successfully');
    } catch (error) {
      console.error('Error updating editor content:', error);
    }
  }

  function getLanguageFromFilename(filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'scss',
      'less': 'less',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'py': 'python',
      'rb': 'ruby',
      'php': 'php',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'r': 'r',
      'sh': 'shell',
      'bash': 'shell',
      'zsh': 'shell',
      'fish': 'shell',
      'ps1': 'powershell',
      'sql': 'sql',
      'dockerfile': 'dockerfile',
      'vue': 'html',
      'svelte': 'html',
    };
    return languageMap[ext] || 'plaintext';
  }

  function selectFile(filename) {
    if ($selectedGist && $selectedGist.files[filename]) {
      $selectedFile = {
        filename,
        content: $selectedGist.files[filename].content,
        language: $selectedGist.files[filename].language
      };
      isEditing = false;
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

<div class="h-full flex flex-col">
  {#if $selectedGist}
    <div class="border-b p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">
          {$selectedGist.description || 'Untitled Gist'}
        </h2>
        <Button variant="outline" size="sm" on:click={showNewFile}>
          <Plus size={16} />
          New File
        </Button>
      </div>

      {#if showNewFileInput}
        <div class="flex gap-2 mb-4">
          <Input
            placeholder="filename.ext"
            bind:value={newFileName}
            on:keydown={(e) => e.key === 'Enter' && createNewFile()}
          />
          <Button size="sm" on:click={createNewFile}>Add</Button>
          <Button variant="outline" size="sm" on:click={() => showNewFileInput = false}>
            Cancel
          </Button>
        </div>
      {/if}

      <div class="flex flex-wrap gap-2">
        {#each Object.entries($selectedGist.files || {}) as [filename, file]}
          <button
            class="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-150 ease-in-out hover:shadow-sm transform hover:scale-105 {$selectedFile?.filename === filename ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary hover:bg-secondary/80'}"
            on:click={() => selectFile(filename)}
          >
            <svelte:component this={getFileIcon(filename)} size={14} />
            {filename}
          </button>
        {/each}
      </div>
    </div>

    {#if $selectedFile}
      <div class="border-b p-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svelte:component this={getFileIcon($selectedFile.filename)} size={16} />
          <span class="font-medium">{$selectedFile.filename}</span>
        </div>
        <div class="flex items-center gap-2">
          {#if isEditing}
            <Button size="sm" on:click={saveFile}>
              <Save size={16} />
              Save
            </Button>
            <Button variant="outline" size="sm" on:click={cancelEditing}>
              Cancel
            </Button>
          {:else}
            <Button variant="outline" size="sm" on:click={startEditing}>
              <Edit3 size={16} />
              Edit
            </Button>
          {/if}
          <Button variant="destructive" size="sm" on:click={deleteFile}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div class="flex-1 relative">
        <!-- Monaco Editor Container - always present -->
        <div
          bind:this={editorContainer}
          class="w-full h-full absolute inset-0"
          class:hidden={!monacoReady || !editor}
        ></div>
        
        <!-- Fallback textarea while Monaco loads -->
        {#if !monacoReady || !editor}
          <textarea
            class="w-full h-full p-4 font-mono text-sm border-0 resize-none focus:outline-none absolute inset-0"
            readonly={!isEditing}
            value={$selectedFile?.content || ''}
            placeholder="Loading editor..."
          ></textarea>
        {/if}
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center text-muted-foreground">
          <p>Select a file to view its contents</p>
        </div>
      </div>
    {/if}
  {:else}
    <div class="flex-1 flex items-center justify-center">
      <div class="text-center text-muted-foreground">
        {#if $isLoading}
          <p>Loading gist...</p>
        {:else}
          <p>Select a gist from the sidebar to get started</p>
        {/if}
      </div>
    </div>
  {/if}
</div>