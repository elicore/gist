<script>
  import GistList from '../lib/components/GistList.svelte';
  import Editor from '../lib/components/Editor.svelte';
  
  let isDark = $state(false);
  
  // Initialize theme state
  $effect(() => {
    if (typeof window !== 'undefined') {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      isDark = currentTheme === 'dark';
    }
  });
  
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    isDark = !isDark;
  };
</script>

<svelte:head>
  <title>Gist Manager</title>
</svelte:head>

<main class="h-screen bg-background text-foreground overflow-hidden">
  <!-- Theme Toggle -->
  <div class="fixed top-4 right-16 z-[9999] bg-red-500 p-2 border border-white">
    <button 
      onclick={toggleTheme}
      class="relative w-12 h-6 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 dark:from-blue-900 dark:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Toggle theme"
    >
      <!-- Toggle Circle with Icon -->
      <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center {isDark ? 'translate-x-6' : 'translate-x-0'}">
        <span class="text-xs">{isDark ? '🌙' : '☀️'}</span>
      </div>
      
      <!-- Background Stars (visible in dark mode) -->
      <div class="absolute inset-0 rounded-full overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-300">
        <div class="w-0.5 h-0.5 bg-white rounded-full absolute top-1 right-2"></div>
        <div class="w-0.5 h-0.5 bg-white rounded-full absolute top-3 right-4"></div>
        <div class="w-0.5 h-0.5 bg-white rounded-full absolute bottom-1.5 right-2.5"></div>
      </div>
    </button>
  </div>

  <!-- Main Content -->
  <div class="flex h-full">
    <!-- Left Panel - Gist List -->
    <div class="w-80 border-r border-border bg-card/30 backdrop-blur-sm transition-all duration-300 ease-out">
      <GistList />
    </div>
    
    <!-- Right Panel - Editor -->
    <div class="flex-1 bg-background/95 backdrop-blur-sm transition-all duration-300 ease-out">
      <Editor />
    </div>
  </div>
</main>