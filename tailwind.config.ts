import type { Config } from "tailwindcss";
const { heroui } = require("@heroui/theme");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", "class"],
  theme: {
  	extend: {
  		colors: {
  			transparent: 'transparent',
  			current: 'currentColor',
  			'underline-color': '#yourColor',
  			white: '#FFFFFF',
  			gray50: '#F9F9F9',
  			gray100: '#EEEEEE',
  			gray200: '#ECECEC',
  			gray300: '#C1C1C1',
  			gray400: '#686868',
  			gray500: '#282828',
  			gray600: '#999',
  			red: '#F05454',
  			yellow: '#F5B461',
  			green: '#9BDEAC',
  			blue: '#66BFBF',
  			lightgreen: '#F2FDFB',
  			brand: {
  				light1: '#d5e4e9',
  				light2: '#cad9de',
  				main: '#134865',
  				light3: '#b6c7cc'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		backgroundImage: {
  			'header-gradient': 'linear-gradient(90deg, #d5e4e9, #cad9de)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  variants: {
    extend: {
      transform: ["group-hover"],
      scale: ["group-hover"],
      transitionDuration: ["group-hover"],
      letterSpacing: ["group-hover"],
      width: ["group-hover"],
      borderColor: ["group-hover"],
    },
    // divideColor: ['group-hover'],
  },
  plugins: [heroui(), require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
export default config;
