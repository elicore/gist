<script>
  const { filename, size = 16 } = $props();
  import { getFileIcon } from '../file-icons.js';
  
  const iconData = getFileIcon(filename);
  
  // Calculate responsive font size based on icon size
  const fontSize = Math.max(6, Math.min(size * 0.4, 12));
  
  // Get current theme from document
  let isDark = $state(false);
  
  $effect(() => {
    if (typeof document !== 'undefined') {
      const updateTheme = () => {
        isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      };
      
      updateTheme();
      
      // Watch for theme changes
      const observer = new MutationObserver(updateTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      
      return () => observer.disconnect();
    }
  });
</script>

{#if iconData.isCustom}
  <div 
    class="inline-flex items-center justify-center rounded font-bold border"
    style="
      width: {size}px; 
      height: {size}px; 
      background-color: {isDark ? iconData.darkBg : iconData.lightBg}; 
      color: {isDark ? iconData.darkText : iconData.lightText};
      border-color: {isDark ? iconData.darkBg : iconData.lightBg};
      font-size: {fontSize}px;
      line-height: 1;
    "
  >
    {iconData.text}
  </div>
{:else}
  <!-- Fallback for old Lucide icons -->
  <iconData size={size}></iconData>
{/if}