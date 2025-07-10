import loader from '@monaco-editor/loader';
import type { MonacoThemeConfig } from './types.js';

// Monaco types - we'll use any for simplicity since Monaco has complex typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let monacoInstance: any = null;

/**
 * Initialize Monaco Editor with custom themes
 * @returns Promise<any> - The Monaco editor instance
 */
export async function initMonaco(): Promise<any> {
  if (monacoInstance) {
    return monacoInstance;
  }

  try {
    console.log('Starting Monaco initialization...');
    monacoInstance = await loader.init();

    // Configure Monaco Editor with VSCode-like settings
    const customDarkTheme: MonacoThemeConfig = {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' }
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#2D2D30',
        'editor.selectionBackground': '#264F78',
        'editorCursor.foreground': '#AEAFAD',
        'editorWhitespace.foreground': '#404040'
      }
    };

    const customLightTheme: MonacoThemeConfig = {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '008000' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'type', foreground: '267F99' },
        { token: 'function', foreground: '795E26' }
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#F7F7F7',
        'editor.selectionBackground': '#ADD6FF',
        'editorCursor.foreground': '#000000',
        'editorWhitespace.foreground': '#BFBFBF'
      }
    };

    monacoInstance.editor.defineTheme('custom-dark', customDarkTheme);
    monacoInstance.editor.defineTheme('custom-light', customLightTheme);

    // GitHub Light Theme
    monacoInstance.editor.defineTheme('github-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D' },
        { token: 'keyword', foreground: 'D73A49' },
        { token: 'string', foreground: '032F62' },
        { token: 'number', foreground: '005CC5' },
        { token: 'type', foreground: '005CC5' },
        { token: 'function', foreground: '6F42C1' }
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#24292E',
        'editor.lineHighlightBackground': '#F6F8FA',
        'editor.selectionBackground': '#C8E1FF',
        'editorCursor.foreground': '#24292E',
        'editorWhitespace.foreground': '#959DA5'
      }
    });

    // GitHub Dark Theme
    monacoInstance.editor.defineTheme('github-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8B949E' },
        { token: 'keyword', foreground: 'FF7B72' },
        { token: 'string', foreground: '7EE787' },
        { token: 'number', foreground: '79C0FF' },
        { token: 'type', foreground: '79C0FF' },
        { token: 'function', foreground: 'D2A8FF' }
      ],
      colors: {
        'editor.background': '#0D1117',
        'editor.foreground': '#C9D1D9',
        'editor.lineHighlightBackground': '#21262D',
        'editor.selectionBackground': '#3C4C5A',
        'editorCursor.foreground': '#C9D1D9',
        'editorWhitespace.foreground': '#484F58'
      }
    });

    // Additional themes...
    const additionalThemes: Record<string, MonacoThemeConfig> = {
      'monokai': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '75715E' },
          { token: 'keyword', foreground: 'F92672' },
          { token: 'string', foreground: 'E6DB74' },
          { token: 'number', foreground: 'AE81FF' },
          { token: 'type', foreground: '66D9EF' },
          { token: 'function', foreground: 'A6E22E' }
        ],
        colors: {
          'editor.background': '#272822',
          'editor.foreground': '#F8F8F2',
          'editor.lineHighlightBackground': '#3E3D32',
          'editor.selectionBackground': '#49483E',
          'editorCursor.foreground': '#F8F8F0',
          'editorWhitespace.foreground': '#3B3A32'
        }
      },
      'dracula': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6272A4' },
          { token: 'keyword', foreground: 'FF79C6' },
          { token: 'string', foreground: 'F1FA8C' },
          { token: 'number', foreground: 'BD93F9' },
          { token: 'type', foreground: '8BE9FD' },
          { token: 'function', foreground: '50FA7B' }
        ],
        colors: {
          'editor.background': '#282A36',
          'editor.foreground': '#F8F8F2',
          'editor.lineHighlightBackground': '#44475A',
          'editor.selectionBackground': '#44475A',
          'editorCursor.foreground': '#F8F8F2',
          'editorWhitespace.foreground': '#6272A4'
        }
      },
      'solarized-dark': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '586E75' },
          { token: 'keyword', foreground: '859900' },
          { token: 'string', foreground: '2AA198' },
          { token: 'number', foreground: 'D33682' },
          { token: 'type', foreground: 'B58900' },
          { token: 'function', foreground: '268BD2' }
        ],
        colors: {
          'editor.background': '#002B36',
          'editor.foreground': '#839496',
          'editor.lineHighlightBackground': '#073642',
          'editor.selectionBackground': '#274642',
          'editorCursor.foreground': '#839496',
          'editorWhitespace.foreground': '#586E75'
        }
      },
      'solarized-light': {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '93A1A1' },
          { token: 'keyword', foreground: '859900' },
          { token: 'string', foreground: '2AA198' },
          { token: 'number', foreground: 'D33682' },
          { token: 'type', foreground: 'B58900' },
          { token: 'function', foreground: '268BD2' }
        ],
        colors: {
          'editor.background': '#FDF6E3',
          'editor.foreground': '#657B83',
          'editor.lineHighlightBackground': '#EEE8D5',
          'editor.selectionBackground': '#D3AF86',
          'editorCursor.foreground': '#657B83',
          'editorWhitespace.foreground': '#93A1A1'
        }
      },
      'one-dark-pro': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '5C6370' },
          { token: 'keyword', foreground: 'C678DD' },
          { token: 'string', foreground: '98C379' },
          { token: 'number', foreground: 'D19A66' },
          { token: 'type', foreground: 'E06C75' },
          { token: 'function', foreground: '61AFEF' }
        ],
        colors: {
          'editor.background': '#282C34',
          'editor.foreground': '#ABB2BF',
          'editor.lineHighlightBackground': '#2C323C',
          'editor.selectionBackground': '#3E4451',
          'editorCursor.foreground': '#528BFF',
          'editorWhitespace.foreground': '#3B4048'
        }
      },
      'night-owl': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '637777' },
          { token: 'keyword', foreground: 'C792EA' },
          { token: 'string', foreground: 'ECC48D' },
          { token: 'number', foreground: 'F78C6C' },
          { token: 'type', foreground: 'FFCB6B' },
          { token: 'function', foreground: '82AAFF' }
        ],
        colors: {
          'editor.background': '#011627',
          'editor.foreground': '#D6DEEB',
          'editor.lineHighlightBackground': '#122D42',
          'editor.selectionBackground': '#1D3B53',
          'editorCursor.foreground': '#80A4C2',
          'editorWhitespace.foreground': '#2D525C'
        }
      },
      'ayu-dark': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '5C6773' },
          { token: 'keyword', foreground: 'FF8F40' },
          { token: 'string', foreground: 'BAE67E' },
          { token: 'number', foreground: 'D4BFFF' },
          { token: 'type', foreground: '5CCFE6' },
          { token: 'function', foreground: 'FFD580' }
        ],
        colors: {
          'editor.background': '#0B0E14',
          'editor.foreground': '#B3B1AD',
          'editor.lineHighlightBackground': '#131721',
          'editor.selectionBackground': '#253340',
          'editorCursor.foreground': '#E6B450',
          'editorWhitespace.foreground': '#4D5566'
        }
      },
      'material-theme': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '546E7A' },
          { token: 'keyword', foreground: 'C792EA' },
          { token: 'string', foreground: 'C3E88D' },
          { token: 'number', foreground: 'F78C6C' },
          { token: 'type', foreground: 'FFCB6B' },
          { token: 'function', foreground: '82AAFF' }
        ],
        colors: {
          'editor.background': '#263238',
          'editor.foreground': '#EEFFFF',
          'editor.lineHighlightBackground': '#2C3B41',
          'editor.selectionBackground': '#37474F',
          'editorCursor.foreground': '#FFCC02',
          'editorWhitespace.foreground': '#546E7A'
        }
      },
      'cobalt2': {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '0088FF' },
          { token: 'keyword', foreground: 'FF9D00' },
          { token: 'string', foreground: '3AD900' },
          { token: 'number', foreground: 'FF0080' },
          { token: 'type', foreground: '80FFBB' },
          { token: 'function', foreground: 'FFEE80' }
        ],
        colors: {
          'editor.background': '#193549',
          'editor.foreground': '#FFFFFF',
          'editor.lineHighlightBackground': '#1E4A5B',
          'editor.selectionBackground': '#18374A',
          'editorCursor.foreground': '#FFCC00',
          'editorWhitespace.foreground': '#2F5F70'
        }
      },
      'light-plus': {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '008000' },
          { token: 'keyword', foreground: '0000FF' },
          { token: 'string', foreground: 'A31515' },
          { token: 'number', foreground: '098658' },
          { token: 'type', foreground: '267F99' },
          { token: 'function', foreground: '795E26' }
        ],
        colors: {
          'editor.background': '#FFFFFF',
          'editor.foreground': '#000000',
          'editor.lineHighlightBackground': '#F3F3F3',
          'editor.selectionBackground': '#ADD6FF',
          'editorCursor.foreground': '#000000',
          'editorWhitespace.foreground': '#BFBFBF'
        }
      },
      'quiet-light': {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '999988' },
          { token: 'keyword', foreground: '333333' },
          { token: 'string', foreground: 'DD1144' },
          { token: 'number', foreground: '009999' },
          { token: 'type', foreground: '445588' },
          { token: 'function', foreground: '990000' }
        ],
        colors: {
          'editor.background': '#F5F5F5',
          'editor.foreground': '#333333',
          'editor.lineHighlightBackground': '#EEEEEE',
          'editor.selectionBackground': '#D5DDF3',
          'editorCursor.foreground': '#666666',
          'editorWhitespace.foreground': '#CCCCCC'
        }
      },
      'winter-light': {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '7C7C7C' },
          { token: 'keyword', foreground: '0066CC' },
          { token: 'string', foreground: '22863A' },
          { token: 'number', foreground: '005CC5' },
          { token: 'type', foreground: '6F42C1' },
          { token: 'function', foreground: '6F42C1' }
        ],
        colors: {
          'editor.background': '#FFFFFF',
          'editor.foreground': '#24292E',
          'editor.lineHighlightBackground': '#F6F8FA',
          'editor.selectionBackground': '#C8E1FF',
          'editorCursor.foreground': '#044289',
          'editorWhitespace.foreground': '#D1D5DA'
        }
      },
      'atom-one-light': {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'comment', foreground: 'A0A1A7' },
          { token: 'keyword', foreground: 'A626A4' },
          { token: 'string', foreground: '50A14F' },
          { token: 'number', foreground: '986801' },
          { token: 'type', foreground: 'C18401' },
          { token: 'function', foreground: '4078F2' }
        ],
        colors: {
          'editor.background': '#FAFAFA',
          'editor.foreground': '#383A42',
          'editor.lineHighlightBackground': '#F0F0F1',
          'editor.selectionBackground': '#E5E5E6',
          'editorCursor.foreground': '#526FFF',
          'editorWhitespace.foreground': '#D0D0D0'
        }
      }
    };

    // Define all additional themes
    Object.entries(additionalThemes).forEach(([themeName, themeConfig]) => {
      monacoInstance!.editor.defineTheme(themeName, themeConfig);
    });

    return monacoInstance;
  } catch (error) {
    console.error('Failed to initialize Monaco Editor:', error);
    throw error;
  }
}

/**
 * Get Monaco language identifier from filename extension
 * @param filename - The filename to analyze
 * @returns Monaco language identifier
 */
export function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();

  const languageMap: Record<string, string> = {
    // Web technologies
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'scss',
    'less': 'less',
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',

    // Documentation
    'md': 'markdown',
    'markdown': 'markdown',
    'txt': 'plaintext',
    'log': 'plaintext',

    // Programming languages
    'py': 'python',
    'rb': 'ruby',
    'php': 'php',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'scala': 'scala',
    'r': 'r',

    // Shell scripts
    'sh': 'shell',
    'bash': 'shell',
    'zsh': 'shell',
    'fish': 'shell',
    'ps1': 'powershell',

    // Databases
    'sql': 'sql',

    // Config files
    'dockerfile': 'dockerfile',
    'toml': 'toml',
    'ini': 'ini',

    // Frontend frameworks
    'vue': 'html',
    'svelte': 'html'
  };

  return ext && languageMap[ext] ? languageMap[ext] : 'plaintext';
}

/**
 * Create a Monaco Editor instance
 * @param container - The DOM element to mount the editor
 * @param options - Editor options to override defaults
 * @returns Monaco Editor instance
 */
export function createEditor(
  container: HTMLElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (!monacoInstance) {
    throw new Error('Monaco Editor not initialized. Call initMonaco() first.');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultOptions: any = {
    value: '',
    language: 'plaintext',
    theme: 'custom-dark',
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Fira Code, SF Mono, Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace',
    lineNumbers: 'on',
    minimap: { enabled: true, scale: 0.6 },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    automaticLayout: true,
    readOnly: false,

    // VSCode-like features
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true
    },
    renderLineHighlight: 'all',
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    multiCursorModifier: 'ctrlCmd',
    formatOnPaste: true,
    formatOnType: true,

    // Code suggestions and IntelliSense
    suggestOnTriggerCharacters: true,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false
    },
    parameterHints: { enabled: true },

    // Advanced editing features
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    matchBrackets: 'always',
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    autoIndent: 'full',

    // Scrollbar and layout
    scrollbar: {
      verticalScrollbarSize: 12,
      horizontalScrollbarSize: 12,
      useShadows: false
    },

    // Find and replace
    find: {
      seedSearchStringFromSelection: 'always',
      autoFindInSelection: 'never'
    }
  };

  const finalOptions = { ...defaultOptions, ...options };
  return monacoInstance.editor.create(container, finalOptions);
}

/**
 * Set the editor theme based on dark/light mode
 * @param editor - The Monaco Editor instance
 * @param isDark - Whether to use dark theme
 */
export function setEditorTheme(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any | null,
  isDark: boolean
): void {
  if (!editor || !monacoInstance) {
    console.log('setEditorTheme: Missing editor or monaco instance');
    return;
  }

  const theme = isDark ? 'custom-dark' : 'custom-light';
  console.log('Setting Monaco editor theme to:', theme, 'isDark:', isDark);

  try {
    monacoInstance.editor.setTheme(theme);
    console.log('Monaco editor theme set successfully');
  } catch (error) {
    console.error('Failed to set Monaco editor theme:', error);
  }
}
