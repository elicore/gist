<script>
  import GistList from '../lib/components/GistList.svelte';
  import Editor from '../lib/components/Editor.svelte';
  import { theme } from '../lib/stores.js';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  let isDark = $state(false);
  let isCollapsed = $state(false);
  let sidebarWidth = $state(320);
  let isDragging = $state(false);
  let currentTheme = $state($theme);

  // Initialize theme on component mount
  $effect(() => {
    if (typeof window !== 'undefined') {
      applyTheme(currentTheme);
    }
  });

  // Watch for theme changes from store
  $effect(() => {
    currentTheme = $theme;
    applyTheme(currentTheme);
  });

  const applyTheme = (themeValue) => {
    if (!themeValue || typeof window === 'undefined') return;

    let resolvedTheme;
    if (themeValue === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = prefersDark ? 'dark' : 'light';
    } else {
      resolvedTheme = themeValue;
    }

    document.documentElement.setAttribute('data-theme', resolvedTheme);
    isDark = resolvedTheme === 'dark';
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    theme.set(newTheme); // Save to persistent store
    applyTheme(newTheme);
  };

  const toggleCollapse = () => {
    isCollapsed = !isCollapsed;
  };

  const handleMouseDown = (e) => {
    isDragging = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newWidth = e.clientX;
    if (newWidth >= 240 && newWidth <= 600) {
      sidebarWidth = newWidth;
    }
  };

  const handleMouseUp = () => {
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
</script>

<svelte:head>
  <title>Gist Manager</title>
</svelte:head>

<main class="h-screen bg-background text-foreground overflow-hidden relative z-10">
  <!-- Theme Toggle -->
  <div class="fixed top-4 right-4 z-[9999]">
    <button
      onclick={toggleTheme}
      class="relative inline-flex items-center justify-center rounded-md w-10 h-10 border border-border bg-card text-card-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
      aria-label="Toggle theme"
    >
      <!-- Sun Icon (visible in dark mode) -->
      <svg 
        class="h-5 w-5 rotate-0 scale-100 transition-all duration-300 {isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'}" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
      
      <!-- Moon Icon (visible in light mode) -->
      <svg 
        class="absolute h-5 w-5 transition-all duration-300 {isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
      
      <span class="sr-only">Toggle theme</span>
    </button>
  </div>

  <!-- Main Content -->
  <div class="flex h-full">
    <!-- Left Panel - Gist List -->
    <div
      class="border-r border-border bg-card/30 backdrop-blur-sm transition-all duration-300 ease-out relative {isCollapsed ? 'w-12' : ''}"
      style="width: {isCollapsed ? '48px' : `${sidebarWidth}px`}"
    >
      <!-- Collapse Toggle Button -->
      <button
        onclick={toggleCollapse}
        class="absolute top-4 right-2 z-10 p-1.5 rounded-md border border-border bg-card hover:bg-accent transition-all duration-200 hover:scale-105"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {#if isCollapsed}
          <ChevronRight size={14} />
        {:else}
          <ChevronLeft size={14} />
        {/if}
      </button>

      <!-- Gist List Content -->
      <div class="h-full {isCollapsed ? 'hidden' : ''}">
        <GistList />
      </div>
    </div>

    <!-- Resize Handle -->
    {#if !isCollapsed}
      <button
        type="button"
        class="w-1 bg-border hover:bg-accent cursor-col-resize transition-colors duration-200 {isDragging ? 'bg-primary' : ''} appearance-none border-none p-0 m-0 h-full focus:outline-none"
        onmousedown={handleMouseDown}
        tabindex="0"
        aria-label="Resize sidebar"
        style="min-width: 4px; width: 4px;"
      ></button>
    {/if}

    <!-- Right Panel - Editor -->
    <div class="flex-1 bg-background/95 backdrop-blur-sm transition-all duration-300 ease-out">
      <Editor />
    </div>
  </div>
</main>
