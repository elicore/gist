<script>
  import './app.css';
  import GistList from './lib/components/GistList.svelte';
  import Editor from './lib/components/Editor.svelte';
</script>

<main class="h-screen bg-background text-foreground">
  <div class="flex h-full">
    <!-- Left Panel - Gist List -->
    <div class="w-1/3 border-r border-border bg-card/50 transition-all duration-200 ease-in-out animate-slide-in-left">
      <GistList />
    </div>
    
    <!-- Right Panel - Editor -->
    <div class="flex-1 bg-background transition-all duration-200 ease-in-out animate-slide-in-right">
      <Editor />
    </div>
  </div>
</main>