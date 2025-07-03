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

<main class="h-screen bg-background text-foreground overflow-hidden">
  <!-- Theme Toggle -->
  <div class="fixed top-4 right-4 z-[9999]">
    <button
      onclick={toggleTheme}
      class="relative w-12 h-6 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 dark:from-blue-900 dark:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
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
