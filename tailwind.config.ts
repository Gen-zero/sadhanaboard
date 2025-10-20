	import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		screens: {
			'xs': '320px',
			'sm-mobile': '375px',
			'mobile': '480px',
			'sm': '640px',
			'md-tablet': '768px',
			'md': '768px',
			'lg-tablet': '1024px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
			'3xl': '1920px',
		},
		container: {
			padding: '0',
			screens: {}
		},
		extend: {
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			touchAction: {
				'manipulation': 'manipulation',
				'pan-x': 'pan-x',
				'pan-y': 'pan-y',
			},
			height: {
				'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
				'touch-target': '44px',
				'touch-target-lg': '48px',
			},
			minHeight: {
				'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
				'touch-target': '44px',
				'touch-target-lg': '48px',
			},
			minWidth: {
				'touch-target': '44px',
				'touch-target-lg': '48px',
			},
			fontFamily: {
				apple: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
				sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
				handwritten: ['Caveat', 'Patrick Hand', 'Kalam', 'Comic Sans MS', 'cursive', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom color palette - our specific named colors
				crimson: '#DC143C',
				ivory: '#FFFFF0',
				charcoal: '#36454F',
				gold: '#FFD700',
				navy: '#000080',
				sage: '#77815C',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				pulse: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				}
				,
				'float-gentle': {
					'0%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-6px)' },
					'100%': { transform: 'translateY(0)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-100% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'ripple': {
					'0%': { transform: 'scale(0)', opacity: '0.6' },
					'100%': { transform: 'scale(2)', opacity: '0' }
				},
				'glow-pulse-soft': {
					'0%': { boxShadow: '0 0 0px rgba(139,92,246,0.12)', transform: 'scale(1)' },
					'50%': { boxShadow: '0 0 18px rgba(139,92,246,0.18)', transform: 'scale(1.02)' },
					'100%': { boxShadow: '0 0 0px rgba(139,92,246,0.12)', transform: 'scale(1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.5s ease-out forwards',
				'pulse-slow': 'pulse 3s ease-in-out infinite'
				,
				'float-gentle': 'float-gentle 4s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'ripple': 'ripple 0.6s ease-out',
				'glow-pulse-soft': 'glow-pulse-soft 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
