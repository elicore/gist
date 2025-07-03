import loader from '@monaco-editor/loader';

let monacoInstance = null;

export async function initMonaco() {
  if (monacoInstance) {
    return monacoInstance;
  }

  try {
    console.log('Starting Monaco initialization...');
    monacoInstance = await loader.init();
    
    // Configure Monaco Editor with VSCode-like settings
    monacoInstance.editor.defineTheme('custom-dark', {
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
    });

    monacoInstance.editor.defineTheme('custom-light', {
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
    });

    return monacoInstance;
  } catch (error) {
    console.error('Failed to initialize Monaco Editor:', error);
    throw error;
  }
}

export function getLanguageFromFilename(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const languageMap = {
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
  
  return languageMap[ext] || 'plaintext';
}

export function createEditor(container, options = {}) {
  if (!monacoInstance) {
    throw new Error('Monaco Editor not initialized. Call initMonaco() first.');
  }

  const defaultOptions = {
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

export function setEditorTheme(editor, isDark) {
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