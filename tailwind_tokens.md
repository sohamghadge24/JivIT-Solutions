# Premium SaaS Tailwind Design Tokens

To achieve the "Stripe/Linear/Vercel/Apple" premium look, integrate these custom tokens into your `tailwind.config.js`.

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          900: '#09090b', // Ultra dark zinc for premium background
          800: '#18181b', // Cards
          700: '#27272a', // Borders / Accents
          100: '#f4f4f5', // Primary Text
          50: '#fafafa',  // Bright highlights
        },
        brand: {
          accent: '#34d399', // Emerald 400 - wellness / modern tech highlight
          glow: 'rgba(52, 211, 153, 0.15)', // Subtle glow effect
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'], // Linear/Stripe style
        mono: ['"JetBrains Mono"', '"SF Mono"', 'monospace'], // Vercel style mono tags
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
        'premium-gradient': 'linear-gradient(180deg, rgba(9,9,11,0) 0%, rgba(9,9,11,1) 100%)',
      },
      boxShadow: {
        'premium-glow': '0 0 40px -10px rgba(255, 255, 255, 0.05)',
        'premium-accent': '0 0 50px -15px rgba(52, 211, 153, 0.15)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        shimmer: {
          'from': { backgroundPosition: '200% 0' },
          'to': { backgroundPosition: '-200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
```

### Key UI Features Used:
- **`from-white/10 to-transparent`**: Glassmorphism and lighting mimicking Apple's materials.
- **`backdrop-blur-md`**: The frosted glass effect on hovering elements.
- **Color choices**: `zinc-900` (`#18181b` and `#09090b`) replace generic blacks for a richer dark mode base.
- **Typography tracking**: `tracking-tight` on headings gives an enterprise Software aura. `tracking-widest` on uppercase overlines.
