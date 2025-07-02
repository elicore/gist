<script>
  import { onMount } from 'svelte';
  import { GitHubGistAPI } from '../github.js';
  import { githubToken, gists, selectedGist, selectedFile, isLoading, error } from '../stores.js';
  import { getFileIcon } from '../file-icons.js';
  import { Star, Eye, GitFork, Calendar, FileText } from 'lucide-svelte';
  import Card from './Card.svelte';
  import Input from './Input.svelte';
  import Button from './Button.svelte';

  let api;
  let searchTerm = '';
  let tokenInput = '';

  $: filteredGists = $gists.filter(gist => 
    gist.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.keys(gist.files).some(filename => 
      filename.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  async function loadGists() {
    if (!$githubToken) return;
    
    try {
      $isLoading = true;
      $error = null;
      api = new GitHubGistAPI($githubToken);
      const gistList = await api.getAllGists();
      $gists = gistList;
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
    if ($githubToken) {
      loadGists();
    }
  });
</script>

<div class="h-full flex flex-col">
  {#if !$githubToken}
    <div class="p-4 space-y-4">
      <h2 class="text-lg font-semibold">GitHub Token Required</h2>
      <p class="text-sm text-muted-foreground">
        Enter your GitHub personal access token to manage your gists.
      </p>
      <div class="space-y-2">
        <Input
          type="password"
          placeholder="GitHub Token"
          bind:value={tokenInput}
          on:keydown={(e) => e.key === 'Enter' && handleTokenSubmit()}
        />
        <Button on:click={handleTokenSubmit} className="w-full">
          Connect to GitHub
        </Button>
      </div>
    </div>
  {:else}
    <div class="p-4 border-b">
      <div class="flex items-center gap-2 mb-4">
        <h2 class="text-lg font-semibold">Your Gists</h2>
        <Button
          variant="outline"
          size="sm"
          on:click={loadGists}
          disabled={$isLoading}
        >
          {$isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>
      <Input
        placeholder="Search gists..."
        bind:value={searchTerm}
      />
    </div>

    <div class="flex-1 overflow-y-auto">
      {#if $error}
        <div class="p-4">
          <div class="text-sm text-destructive">Error: {$error}</div>
        </div>
      {:else if $isLoading}
        <div class="p-4">
          <div class="text-sm text-muted-foreground">Loading gists...</div>
        </div>
      {:else if filteredGists.length === 0}
        <div class="p-4">
          <div class="text-sm text-muted-foreground">No gists found.</div>
        </div>
      {:else}
        <div class="p-4 space-y-2">
          {#each filteredGists as gist (gist.id)}
            <Card
              className="cursor-pointer transition-all duration-200 ease-in-out hover:bg-accent/50 hover:shadow-md transform hover:scale-[1.02] {$selectedGist?.id === gist.id ? 'ring-2 ring-primary bg-accent/30' : ''}"
            >
              <div 
                class="p-4 space-y-2"
                on:click={() => {
                  // console.log('Card clicked!');
                  selectGist(gist);
                }}
                role="button"
                tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && selectGist(gist)}
              >
                <div class="flex items-start justify-between">
                  <h3 class="font-medium truncate">
                    {gist.description || 'Untitled Gist'}
                  </h3>
                  <div class="flex items-center gap-1 text-xs text-muted-foreground">
                    {#if gist.public}
                      <Eye size={12} />
                    {:else}
                      <FileText size={12} />
                    {/if}
                  </div>
                </div>

                <div class="flex items-center gap-4 text-xs text-muted-foreground">
                  <div class="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(gist.updated_at)}
                  </div>
                  <div class="flex items-center gap-1">
                    <FileText size={12} />
                    {Object.keys(gist.files).length} file{Object.keys(gist.files).length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div class="flex flex-wrap gap-1">
                  {#each Object.entries(gist.files).slice(0, 3) as [filename, file]}
                    <div class="flex items-center gap-1 px-2 py-1 bg-secondary/50 rounded text-xs">
                      <svelte:component this={getFileIcon(filename)} size={10} />
                      <span class="truncate max-w-20">{filename}</span>
                    </div>
                  {/each}
                  {#if Object.keys(gist.files).length > 3}
                    <div class="px-2 py-1 bg-secondary/50 rounded text-xs">
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