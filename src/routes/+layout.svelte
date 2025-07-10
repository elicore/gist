<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { theme } from '../lib/stores.ts';

  onMount(() => {
    // Apply theme to document
    const applyTheme = (themeValue) => {
      console.log('Applying theme:', themeValue);
      if (themeValue === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const actualTheme = isDark ? 'dark' : 'light';
        console.log('System theme resolved to:', actualTheme);
        document.documentElement.setAttribute('data-theme', actualTheme);
      } else {
        document.documentElement.setAttribute('data-theme', themeValue);
      }
    };

    // Apply initial theme
    const initialTheme = $theme || 'system';
    console.log('Initial theme:', initialTheme);
    applyTheme(initialTheme);

    // Listen for theme changes
    const unsubscribe = theme.subscribe((newTheme) => {
      console.log('Theme changed to:', newTheme);
      applyTheme(newTheme);
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      console.log('System theme changed, current theme setting:', $theme);
      if ($theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      unsubscribe();
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  });
</script>

<slot />

