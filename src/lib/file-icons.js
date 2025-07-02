import {
  FileText,
  Code,
  Hash,
  Globe,
  Braces,
  Terminal,
  Image,
  File,
  Database,
  Settings,
  BookOpen,
  Zap
} from 'lucide-svelte';

export const getFileIcon = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const iconMap = {
    // Web
    'html': Globe,
    'htm': Globe,
    'css': Hash,
    'scss': Hash,
    'sass': Hash,
    'less': Hash,
    
    // JavaScript
    'js': Code,
    'jsx': Code,
    'ts': Code,
    'tsx': Code,
    'mjs': Code,
    'cjs': Code,
    
    // Other languages
    'py': Code,
    'rb': Code,
    'php': Code,
    'java': Code,
    'cpp': Code,
    'c': Code,
    'cs': Code,
    'go': Code,
    'rs': Code,
    'swift': Code,
    'kt': Code,
    'scala': Code,
    'r': Code,
    'sh': Terminal,
    'bash': Terminal,
    'zsh': Terminal,
    'fish': Terminal,
    'ps1': Terminal,
    'bat': Terminal,
    'cmd': Terminal,
    
    // Data
    'json': Braces,
    'xml': Braces,
    'yaml': Braces,
    'yml': Braces,
    'toml': Braces,
    'csv': Database,
    'sql': Database,
    
    // Images
    'png': Image,
    'jpg': Image,
    'jpeg': Image,
    'gif': Image,
    'svg': Image,
    'webp': Image,
    'ico': Image,
    
    // Documents
    'md': BookOpen,
    'mdx': BookOpen,
    'txt': FileText,
    'rst': FileText,
    'rtf': FileText,
    
    // Config
    'env': Settings,
    'ini': Settings,
    'cfg': Settings,
    'conf': Settings,
    'config': Settings,
    'lock': Settings,
    
    // Special
    'dockerfile': Settings,
    'gitignore': Settings,
    'gitattributes': Settings,
    'editorconfig': Settings,
    'prettierrc': Settings,
    'eslintrc': Settings,
    'babelrc': Settings,
    'npmrc': Settings,
    'nvmrc': Settings,
    'gemfile': Settings,
    'rakefile': Settings,
    'makefile': Settings,
    'cmakelists': Settings,
    'procfile': Settings,
    'requirements': Settings,
    'pipfile': Settings,
    'poetry': Settings,
    'cargo': Settings,
    'package': Braces,
    'composer': Braces,
    
    // Templates
    'vue': Zap,
    'svelte': Zap,
    'hbs': Zap,
    'handlebars': Zap,
    'mustache': Zap,
    'twig': Zap,
    'erb': Zap,
    'ejs': Zap,
    'pug': Zap,
    'jade': Zap,
  };
  
  return iconMap[ext] || File;
};