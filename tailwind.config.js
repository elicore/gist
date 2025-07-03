/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        border: 'rgb(var(--color-border))',
        input: 'rgb(var(--color-input))',
        ring: 'rgb(var(--color-ring))',
        background: 'rgb(var(--color-background))',
        foreground: 'rgb(var(--color-foreground))',
        primary: {
          DEFAULT: 'rgb(var(--color-primary))',
          foreground: 'rgb(var(--color-primary-foreground))'
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary))',
          foreground: 'rgb(var(--color-secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'rgb(var(--color-destructive))',
          foreground: 'rgb(var(--color-destructive-foreground))'
        },
        muted: {
          DEFAULT: 'rgb(var(--color-muted))',
          foreground: 'rgb(var(--color-muted-foreground))'
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent))',
          foreground: 'rgb(var(--color-accent-foreground))'
        },
        popover: {
          DEFAULT: 'rgb(var(--color-popover))',
          foreground: 'rgb(var(--color-popover-foreground))'
        },
        card: {
          DEFAULT: 'rgb(var(--color-card))',
          foreground: 'rgb(var(--color-card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      animation: {
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out'
      },
      keyframes: {
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      scale: {
        '98': '0.98'
      }
    }
  },
  plugins: []
};