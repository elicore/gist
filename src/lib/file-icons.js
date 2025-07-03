// Enhanced file icon system with better visual distinction
export const getFileIcon = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const name = filename.toLowerCase();
  
  // Return an object with text, colors, and styling info
  // Updated to use theme-appropriate colors that work well in both light and dark modes
  const createFileIcon = (text, lightBg, darkBg, lightText = 'white', darkText = 'white') => ({
    text,
    lightBg,
    darkBg,
    lightText,
    darkText,
    isCustom: true
  });
  
  // Special files (check full filename first)
  const specialFiles = {
    'package.json': createFileIcon('PKG', '#E53E3E', '#FC8181'),
    'tsconfig.json': createFileIcon('TS', '#2B6CB0', '#63B3ED'),
    'webpack.config.js': createFileIcon('WP', '#2B6CB0', '#63B3ED'),
    'vite.config.js': createFileIcon('V', '#553C9A', '#9F7AEA'),
    'next.config.js': createFileIcon('N', '#2D3748', '#CBD5E0', 'white', '#2D3748'),
    'nuxt.config.js': createFileIcon('NX', '#38A169', '#68D391'),
    'svelte.config.js': createFileIcon('SV', '#E53E3E', '#FC8181'),
    'tailwind.config.js': createFileIcon('TW', '#0987A0', '#4FD1C7'),
    'dockerfile': createFileIcon('DK', '#2B6CB0', '#63B3ED'),
    'docker-compose.yml': createFileIcon('DC', '#2B6CB0', '#63B3ED'),
    'readme.md': createFileIcon('RM', '#2B6CB0', '#63B3ED'),
    '.gitignore': createFileIcon('GI', '#E53E3E', '#FC8181'),
    '.env': createFileIcon('EN', '#D69E2E', '#F6E05E', '#2D3748', '#2D3748'),
    '.env.local': createFileIcon('EN', '#D69E2E', '#F6E05E', '#2D3748', '#2D3748'),
    '.env.example': createFileIcon('EN', '#D69E2E', '#F6E05E', '#2D3748', '#2D3748'),
    'cargo.toml': createFileIcon('CR', '#2D3748', '#CBD5E0', 'white', '#2D3748'),
    'gemfile': createFileIcon('GEM', '#E53E3E', '#FC8181'),
    'makefile': createFileIcon('MK', '#38A169', '#68D391'),
    'requirements.txt': createFileIcon('REQ', '#2B6CB0', '#63B3ED'),
  };
  
  if (specialFiles[name]) {
    return specialFiles[name];
  }
  
  // Extension-based icons
  const extensionMap = {
    // JavaScript & TypeScript
    'js': createFileIcon('JS', '#D69E2E', '#F6E05E', '#2D3748', '#2D3748'),
    'jsx': createFileIcon('JSX', '#0987A0', '#4FD1C7'),
    'ts': createFileIcon('TS', '#2B6CB0', '#63B3ED'),
    'tsx': createFileIcon('TSX', '#2B6CB0', '#63B3ED'),
    'mjs': createFileIcon('MJS', '#D69E2E', '#F6E05E', '#2D3748', '#2D3748'),
    'cjs': createFileIcon('CJS', '#D69E2E', '#F6E05E', '#2D3748', '#2D3748'),
    
    // Web Technologies
    'html': createFileIcon('HTML', '#E53E3E', '#FC8181'),
    'htm': createFileIcon('HTM', '#E53E3E', '#FC8181'),
    'css': createFileIcon('CSS', '#2B6CB0', '#63B3ED'),
    'scss': createFileIcon('SCSS', '#B83280', '#F687B3'),
    'sass': createFileIcon('SASS', '#B83280', '#F687B3'),
    'less': createFileIcon('LESS', '#2B6CB0', '#63B3ED'),
    'vue': createFileIcon('VUE', '#38A169', '#68D391'),
    'svelte': createFileIcon('SV', '#E53E3E', '#FC8181'),
    
    // Programming Languages
    'py': createFileIcon('PY', '#2B6CB0', '#63B3ED'),
    'rb': createFileIcon('RB', '#E53E3E', '#FC8181'),
    'php': createFileIcon('PHP', '#553C9A', '#9F7AEA'),
    'java': createFileIcon('JAVA', '#D69E2E', '#F6E05E', '#2D3748', '#2D3748'),
    'cpp': createFileIcon('C++', '#2B6CB0', '#63B3ED'),
    'c': createFileIcon('C', '#718096', '#A0AEC0', 'white', '#2D3748'),
    'cs': createFileIcon('C#', '#38A169', '#68D391'),
    'go': createFileIcon('GO', '#0987A0', '#4FD1C7'),
    'rs': createFileIcon('RS', '#2D3748', '#CBD5E0', 'white', '#2D3748'),
    'swift': createFileIcon('SW', '#DD6B20', '#F6AD55'),
    'kt': createFileIcon('KT', '#553C9A', '#9F7AEA'),
    'scala': createFileIcon('SC', '#E53E3E', '#FC8181'),
    'r': createFileIcon('R', '#2B6CB0', '#63B3ED'),
    
    // Shell Scripts
    'sh': createFileIcon('SH', '#4EAA25', 'white'),
    'bash': createFileIcon('BASH', '#4EAA25', 'white'),
    'zsh': createFileIcon('ZSH', '#4EAA25', 'white'),
    'fish': createFileIcon('FISH', '#4EAA25', 'white'),
    'ps1': createFileIcon('PS1', '#012456', 'white'),
    'bat': createFileIcon('BAT', '#4D4D4D', 'white'),
    'cmd': createFileIcon('CMD', '#4D4D4D', 'white'),
    
    // Data & Config
    'json': createFileIcon('JSON', '#000000', 'white'),
    'xml': createFileIcon('XML', '#005FAD', 'white'),
    'yaml': createFileIcon('YAML', '#CB171E', 'white'),
    'yml': createFileIcon('YML', '#CB171E', 'white'),
    'toml': createFileIcon('TOML', '#9C4221', 'white'),
    'csv': createFileIcon('CSV', '#217346', 'white'),
    'sql': createFileIcon('SQL', '#336791', 'white'),
    'db': createFileIcon('DB', '#336791', 'white'),
    'sqlite': createFileIcon('SQL', '#003B57', 'white'),
    
    // Images
    'png': createFileIcon('PNG', '#FF6B6B', 'white'),
    'jpg': createFileIcon('JPG', '#4ECDC4', 'white'),
    'jpeg': createFileIcon('JPEG', '#4ECDC4', 'white'),
    'gif': createFileIcon('GIF', '#45B7D1', 'white'),
    'svg': createFileIcon('SVG', '#FFB347', '#2D2D2D'),
    'webp': createFileIcon('WEBP', '#6B73FF', 'white'),
    'ico': createFileIcon('ICO', '#96CEB4', 'white'),
    'bmp': createFileIcon('BMP', '#FECA57', '#2D2D2D'),
    
    // Documents
    'md': createFileIcon('MD', '#083FA1', 'white'),
    'mdx': createFileIcon('MDX', '#1B1F23', 'white'),
    'txt': createFileIcon('TXT', '#6C757D', 'white'),
    'rst': createFileIcon('RST', '#6C757D', 'white'),
    'rtf': createFileIcon('RTF', '#6C757D', 'white'),
    'pdf': createFileIcon('PDF', '#DC3545', 'white'),
    'doc': createFileIcon('DOC', '#2B579A', 'white'),
    'docx': createFileIcon('DOCX', '#2B579A', 'white'),
    
    // Archive
    'zip': createFileIcon('ZIP', '#FD79A8', 'white'),
    'tar': createFileIcon('TAR', '#636E72', 'white'),
    'gz': createFileIcon('GZ', '#636E72', 'white'),
    'rar': createFileIcon('RAR', '#FD79A8', 'white'),
    '7z': createFileIcon('7Z', '#74B9FF', 'white'),
    
    // Config Files
    'ini': createFileIcon('INI', '#6C757D', 'white'),
    'cfg': createFileIcon('CFG', '#6C757D', 'white'),
    'conf': createFileIcon('CONF', '#6C757D', 'white'),
    'config': createFileIcon('CFG', '#6C757D', 'white'),
    'lock': createFileIcon('LOCK', '#E17055', 'white'),
    
    // Templates
    'hbs': createFileIcon('HBS', '#F0652A', 'white'),
    'handlebars': createFileIcon('HB', '#F0652A', 'white'),
    'mustache': createFileIcon('{{}}', '#F0652A', 'white'),
    'twig': createFileIcon('TWIG', '#8CBF3F', 'white'),
    'erb': createFileIcon('ERB', '#CC342D', 'white'),
    'ejs': createFileIcon('EJS', '#90A93A', 'white'),
    'pug': createFileIcon('PUG', '#A86454', 'white'),
    'jade': createFileIcon('JADE', '#A86454', 'white'),
    
    // Font files
    'ttf': createFileIcon('TTF', '#9C27B0', 'white'),
    'otf': createFileIcon('OTF', '#9C27B0', 'white'),
    'woff': createFileIcon('WOFF', '#9C27B0', 'white'),
    'woff2': createFileIcon('WOFF2', '#9C27B0', 'white'),
    'eot': createFileIcon('EOT', '#9C27B0', 'white'),
  };
  
  return extensionMap[ext] || createFileIcon('FILE', '#718096', '#A0AEC0', 'white', '#2D3748');
};