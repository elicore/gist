<script>
  import { onMount } from 'svelte';
  import { Sun, Moon, Monitor, Palette, Key } from 'lucide-svelte';
  import Button from './Button.svelte';
  import Input from './Input.svelte';
  import { theme, editorTheme, githubToken } from '../stores.ts';

  // Theme options
  const themes = ['system', 'light', 'dark'];
  const themeIcons = { system: Monitor, light: Sun, dark: Moon };

  // Editor theme options
  const editorThemes = [
    'vs', 'vs-dark', 'hc-black', 'hc-light',
    'github', 'monokai', 'tomorrow-night-blue',
    'solarized-dark', 'solarized-light'
  ];

  let currentTheme = $state($theme);
  let currentEditorTheme = $state($editorTheme);
  let currentGithubToken = $state($githubToken);

  const handleThemeChange = (newTheme) => {
    currentTheme = newTheme;
    theme.set(newTheme);

    // Apply theme immediately
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const handleEditorThemeChange = (newTheme) => {
    currentEditorTheme = newTheme;
    editorTheme.set(newTheme);
  };

  const handleTokenSave = () => {
    githubToken.set(currentGithubToken);
  };

  const testToken = async () => {
    if (!currentGithubToken.trim()) return;

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${currentGithubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const user = await response.json();
        alert(`Token valid! Connected as: ${user.login}`);
      } else {
        alert('Invalid token. Please check your GitHub token.');
      }
    } catch (error) {
      alert('Error testing token. Please check your connection.');
    }
  };
</script>

<div class="space-y-8">
  <!-- Theme Selection -->
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <Palette size={20} class="text-muted-foreground" />
      <h3 class="text-lg font-medium">Appearance</h3>
    </div>

    <div class="grid grid-cols-3 gap-3">
      {#each themes as themeOption}
        {@const IconComponent = themeIcons[themeOption]}
        <button
          onclick={() => handleThemeChange(themeOption)}
          class="flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200 {
            currentTheme === themeOption
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-accent-foreground hover:bg-accent'
          }"
        >
          <IconComponent size={24} />
          <span class="text-sm font-medium capitalize">{themeOption}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Editor Theme Selection -->
  <div class="space-y-4">
    <h3 class="text-lg font-medium">Editor Theme</h3>

    <div class="grid grid-cols-2 gap-2">
      {#each editorThemes as editorThemeOption}
        <button
          onclick={() => handleEditorThemeChange(editorThemeOption)}
          class="p-3 text-left rounded-lg border transition-all duration-200 {
            currentEditorTheme === editorThemeOption
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-accent-foreground hover:bg-accent'
          }"
        >
          <span class="text-sm font-medium">{editorThemeOption}</span>
        </button>
      {/each}
    </div>

    <div class="p-4 bg-muted/50 rounded-lg">
      <p class="text-sm text-muted-foreground">
        Preview your selected theme: <strong>{currentEditorTheme}</strong>
      </p>
    </div>
  </div>

  <!-- GitHub Token -->
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <Key size={20} class="text-muted-foreground" />
      <h3 class="text-lg font-medium">GitHub Integration</h3>
    </div>

    <div class="space-y-3">
      <div class="space-y-2">
        <label for="github-token" class="text-sm font-medium">
          Personal Access Token
        </label>
        <Input
          id="github-token"
          type="password"
          bind:value={currentGithubToken}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          class="font-mono text-sm"
        />
      </div>

      <div class="flex gap-2">
        <Button onclick={handleTokenSave} variant="default">
          Save Token
        </Button>
        <Button onclick={testToken} variant="outline">
          Test Connection
        </Button>
      </div>

      <div class="p-4 bg-muted/50 rounded-lg">
        <p class="text-sm text-muted-foreground">
          Create a personal access token at
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:underline"
          >
            GitHub Settings → Developer settings → Personal access tokens
          </a>
        </p>
        <p class="text-xs text-muted-foreground mt-2">
          Required scopes: <code class="bg-background px-1 py-0.5 rounded">gist</code>
        </p>
      </div>
    </div>
  </div>
</div>
