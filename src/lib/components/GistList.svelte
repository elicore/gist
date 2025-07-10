<script>
  import { onMount } from 'svelte';
  import { GitHubGistAPI } from '../github.ts';
  import { githubToken, gists, selectedGist, selectedFile, isLoading, error } from '../stores.ts';
  import FileIcon from './FileIcon.svelte';
  import { Star, Eye, GitFork, Calendar, FileText, Search, RefreshCw } from 'lucide-svelte';
  import Card from './Card.svelte';
  import Input from './Input.svelte';
  import Button from './Button.svelte';

  let api;
  let searchTerm = $state('');
  let tokenInput = $state('');
  let lastUpdateTime = $state(null);

  let filteredGists = $derived($gists.filter(gist =>
    gist.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.keys(gist.files).some(filename =>
      filename.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ));

  async function loadGists() {
    if (!$githubToken) return;

    try {
      $isLoading = true;
      $error = null;
      api = new GitHubGistAPI($githubToken);
      const gistList = await api.getAllGists();
      $gists = gistList;
      lastUpdateTime = new Date();
    } catch (err) {
      $error = err.message;
    } finally {
      $isLoading = false;
    }
  }

  async function selectGist(gist) {
    console.log('Selecting gist:', gist);
    try {
      $isLoading = true;
      $error = null;
      console.log('API instance:', api);

      // Fetch the full gist data with file contents
      const fullGist = await api.getGist(gist.id);
      console.log('Loaded full gist:', fullGist);
      console.log('Files in gist:', Object.keys(fullGist.files || {}));

      $selectedGist = fullGist;
      console.log('Selected gist store updated:', $selectedGist);

      // Auto-select the first file if available
      const filenames = Object.keys(fullGist.files || {});
      if (filenames.length > 0) {
        const firstFilename = filenames[0];
        const fileData = {
          filename: firstFilename,
          content: fullGist.files[firstFilename].content,
          language: fullGist.files[firstFilename].language
        };
        console.log('Auto-selecting file:', fileData);
        $selectedFile = fileData;
        console.log('Selected file store updated:', $selectedFile);
      } else {
        console.log('No files in gist');
        $selectedFile = null;
      }
    } catch (err) {
      console.error('Error selecting gist:', err);
      $error = err.message;
    } finally {
      $isLoading = false;
      console.log('Loading finished');
    }
  }

  function handleTokenSubmit() {
    $githubToken = tokenInput;
    loadGists();
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
  }

  onMount(() => {
    // Load gists if token is already available
    if ($githubToken) {
      loadGists();
    }
  });

  // Watch for changes to the github token
  $effect(() => {
    if ($githubToken && api === undefined) {
      loadGists();
    }
  });
</script>

<div class="h-full flex flex-col bg-gradient-to-b from-card/50 to-background/50">
  {#if !$githubToken}
    <div class="p-6 space-y-6">
      <div class="text-center space-y-3">
        <div class="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <FileText size={32} class="text-primary" />
        </div>
        <h2 class="text-xl font-semibold">Connect to GitHub</h2>
        <p class="text-sm text-muted-foreground max-w-sm">
          Enter your GitHub personal access token to manage your gists and start organizing your code snippets.
        </p>
      </div>
      <div class="space-y-3">
        <Input
          type="password"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          bind:value={tokenInput}
          onkeydown={(e) => e.key === 'Enter' && handleTokenSubmit()}
          class="font-mono text-sm"
        />
        <Button onclick={handleTokenSubmit} className="w-full h-11">
          Connect to GitHub
        </Button>
      </div>
    </div>
  {:else}
    <div class="p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div class="flex items-center gap-3 mb-4">
        <h2 class="text-lg font-semibold text-foreground">Your Gists</h2>
        <button
          onclick={loadGists}
          disabled={$isLoading}
          class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 disabled:opacity-50"
          title={lastUpdateTime ? `Last updated: ${lastUpdateTime.toLocaleTimeString()}` : 'Click to refresh'}
        >
          <RefreshCw size={14} class={$isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div class="relative">
        <Search size={16} class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search gists..."
          bind:value={searchTerm}
          class="pl-10 bg-background/80 backdrop-blur-sm"
        />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto scrollbar-custom">
      {#if $error}
        <div class="p-6 flex items-center justify-center">
          <div class="text-center space-y-2">
            <div class="w-12 h-12 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <FileText size={24} class="text-destructive" />
            </div>
            <p class="text-sm text-destructive font-medium">Connection Error</p>
            <p class="text-xs text-muted-foreground">{$error}</p>
          </div>
        </div>
      {:else if $isLoading}
        <div class="p-6 flex items-center justify-center">
          <div class="text-center space-y-3">
            <div class="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm text-muted-foreground">Loading your gists...</p>
          </div>
        </div>
      {:else if filteredGists.length === 0}
        <div class="p-6 flex items-center justify-center">
          <div class="text-center space-y-2">
            <div class="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Search size={24} class="text-muted-foreground" />
            </div>
            <p class="text-sm text-muted-foreground">
              {searchTerm ? 'No matching gists found' : 'No gists found'}
            </p>
          </div>
        </div>
      {:else}
        <div class="p-3 space-y-3">
          {#each filteredGists as gist (gist.id)}
            <Card
              className="cursor-pointer transition-all duration-300 ease-out hover:bg-accent/80 hover:shadow-lg hover:shadow-primary/5 transform hover:translate-y-[-2px] active:translate-y-0 active:scale-98 {$selectedGist?.id === gist.id ? 'ring-2 ring-primary/50 bg-primary/5 shadow-md' : 'hover:border-accent-foreground/20'}"
            >
              <div
                class="p-4 space-y-3"
                onclick={() => selectGist(gist)}
                role="button"
                tabindex="0"
                onkeydown={(e) => e.key === 'Enter' && selectGist(gist)}
              >
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-semibold text-foreground truncate leading-5">
                    {gist.description || 'Untitled Gist'}
                  </h3>
                  <div class="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    {#if gist.public}
                      <Eye size={14} />
                    {:else}
                      <FileText size={14} />
                    {/if}
                  </div>
                </div>

                <div class="flex items-center gap-4 text-xs text-muted-foreground">
                  <div class="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>{formatDate(gist.updated_at)}</span>
                  </div>
                  {#if Object.keys(gist.files).length > 1}
                    <div class="flex items-center gap-1.5">
                      <FileText size={12} />
                      <span>{Object.keys(gist.files).length} files</span>
                    </div>
                  {/if}
                </div>

                <div class="flex flex-wrap gap-1.5">
                  {#each Object.entries(gist.files).slice(0, 3) as [filename, file]}
                    <div class="flex items-center gap-1.5 px-2.5 py-1.5 bg-secondary/60 hover:bg-secondary/80 rounded-md text-xs font-medium transition-colors">
                      <FileIcon filename={filename} size={12} />
                      <span class="truncate max-w-24">{filename}</span>
                    </div>
                  {/each}
                  {#if Object.keys(gist.files).length > 3}
                    <div class="px-2.5 py-1.5 bg-muted/80 rounded-md text-xs font-medium text-muted-foreground">
                      +{Object.keys(gist.files).length - 3} more
                    </div>
                  {/if}
                </div>
              </div>
            </Card>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
