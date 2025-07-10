<script>
  import { cn } from '../utils.ts';

  export let className = '';
</script>

<div
  class={cn(
    'rounded-lg border bg-card text-card-foreground shadow-sm',
    className
  )}
  {...$$restProps}
>
  <slot />
</div>
