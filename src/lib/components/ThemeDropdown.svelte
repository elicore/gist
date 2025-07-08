<script>
  import { Sun, Moon, Monitor, Palette, Key } from 'lucide-svelte';
  import Button from './Button.svelte';
  import Input from './Input.svelte';
  import { theme, githubToken } from '../stores.js';
  
  const { onClose = () => {} } = $props();
  
  // Theme options
  const themes = ['system', 'light', 'dark'];
  const themeIcons = { system: Monitor, light: Sun, dark: Moon };
  
  let currentTheme = $state($theme);
  let currentGithubToken = $state($githubToken);
  
  // Apply theme when component loads and when currentTheme changes
  $effect(() => {
    if (typeof window !== 'undefined' && currentTheme) {
      console.log('Applying theme:', currentTheme);
      applyTheme(currentTheme);
    }
  });
  
  const handleThemeChange = (newTheme) => {
    currentTheme = newTheme;
    theme.set(newTheme);
    
    // Apply theme immediately
    applyTheme(newTheme);
  };
  
  const applyTheme = (themeValue) => {
    console.log('ThemeDropdown applyTheme called with:', themeValue);
    if (!themeValue) {
      console.log('No theme value provided, returning');
      return;
    }
    
    let resolvedTheme;
    if (themeValue === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolvedTheme = isDark ? 'dark' : 'light';
      console.log('System theme resolved to:', resolvedTheme, 'based on media query:', isDark);
    } else {
      resolvedTheme = themeValue;
      console.log('Using explicit theme:', resolvedTheme);
    }
    
    // Check current theme before changing
    const currentTheme = document.documentElement.getAttribute('data-theme');
    console.log('Current document theme:', currentTheme, '-> New theme:', resolvedTheme);
    
    // Apply the theme to the document
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    
    // Verify the theme was applied
    const appliedTheme = document.documentElement.getAttribute('data-theme');
    console.log('Theme applied. Verified document theme is now:', appliedTheme);
    
    // The Monaco Editor will automatically pick up theme changes via MutationObserver
    console.log('Theme change complete');
  };
  
  
  const handleTokenSave = () => {
    githubToken.set(currentGithubToken);
  };
</script>

<div class="bg-card rounded-xl border border-border shadow-2xl min-w-72 max-w-sm animate-scale-in" onclick={(e) => e.stopPropagation()}>
  <!-- Header -->
  <div class="p-4 border-b border-border">
    <div class="flex items-center gap-2">
      <Palette size={16} class="text-muted-foreground" />
      <h3 class="font-semibold text-sm">Appearance & Settings</h3>
    </div>
  </div>

  <div class="p-4 space-y-4">
    <!-- Theme Selection -->
    <div class="space-y-2">
      <label class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Theme</label>
      <div class="grid grid-cols-3 gap-2">
        {#each themes as themeOption}
          {@const IconComponent = themeIcons[themeOption]}
          <button
            onclick={() => handleThemeChange(themeOption)}
            class="flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-200 text-xs {
              currentTheme === themeOption 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border hover:border-accent-foreground hover:bg-accent'
            }"
          >
            <IconComponent size={16} />
            <span class="font-medium capitalize">{themeOption}</span>
          </button>
        {/each}
      </div>
    </div>
    
    <!-- Info about editor theme -->
    <div class="space-y-2">
      <label class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Editor Style</label>
      <div class="p-3 bg-muted/50 rounded-lg">
        <p class="text-xs text-muted-foreground">
          Editor theme automatically matches your app theme for the best experience.
        </p>
      </div>
    </div>
    
    <!-- GitHub Token -->
    <div class="space-y-2">
      <label class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Key size={12} class="inline mr-1" />
        GitHub Token
      </label>
      <div class="space-y-2">
        <Input
          type="password"
          bind:value={currentGithubToken}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          class="text-xs font-mono"
        />
        <Button onclick={handleTokenSave} size="sm" class="w-full text-xs">
          Save Token
        </Button>
      </div>
    </div>
  </div>
</div>

<!-- Click outside to close -->
<div class="fixed inset-0 z-[-1]" onclick={onClose}></div>