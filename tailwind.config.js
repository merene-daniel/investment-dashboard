/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			display: [
  				'var(--font-display)',
  				'Georgia',
  				'serif'
  			],
  			body: [
  				'var(--font-body)',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-mono)',
  				'monospace'
  			]
  		},
  		colors: {
  			obsidian: {
  				'50': '#f5f5f0',
  				'100': '#e8e8e0',
  				'200': '#d0cfc4',
  				'300': '#b0ae9e',
  				'400': '#8c8a77',
  				'500': '#706e5c',
  				'600': '#585748',
  				'700': '#47463a',
  				'800': '#3c3b31',
  				'900': '#35342b',
  				'950': '#1a1a14'
  			},
  			gold: {
  				'50': '#fefce8',
  				'100': '#fef9c3',
  				'200': '#fef08a',
  				'300': '#fde047',
  				'400': '#facc15',
  				'500': '#eab308',
  				'600': '#ca8a04',
  				'700': '#a16207',
  				'800': '#854d0e',
  				'900': '#713f12'
  			},
  			emerald: {
  				profit: '#10b981',
  				loss: '#ef4444'
  			},
  			background: 'var(--bg-primary)',
  			foreground: 'var(--text-primary)',
  			card: {
  				DEFAULT: 'var(--bg-card)',
  				foreground: 'var(--text-primary)'
  			},
  			popover: {
  				DEFAULT: 'var(--bg-card)',
  				foreground: 'var(--text-primary)'
  			},
  			primary: {
  				DEFAULT: 'var(--gold)',
  				foreground: '#000000'
  			},
  			secondary: {
  				DEFAULT: 'var(--bg-secondary)',
  				foreground: 'var(--text-secondary)'
  			},
  			muted: {
  				DEFAULT: 'var(--bg-secondary)',
  				foreground: 'var(--text-muted)'
  			},
  			accent: {
  				DEFAULT: 'var(--bg-card-hover)',
  				foreground: 'var(--text-primary)'
  			},
  			destructive: {
  				DEFAULT: 'var(--loss)',
  				foreground: '#ffffff'
  			},
  			border: 'var(--border)',
  			input: 'var(--bg-card)',
  			ring: 'var(--gold)'
  		},
  		borderRadius: {
  			lg: '0.75rem',
  			md: '0.5rem',
  			sm: '0.375rem'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.6s ease-out forwards',
  			'slide-up': 'slideUp 0.5s ease-out forwards',
  			'pulse-slow': 'pulse 3s ease-in-out infinite',
  			ticker: 'ticker 20s linear infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			ticker: {
  				'0%': {
  					transform: 'translateX(0)'
  				},
  				'100%': {
  					transform: 'translateX(-50%)'
  				}
  			},
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
  			}
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
}
