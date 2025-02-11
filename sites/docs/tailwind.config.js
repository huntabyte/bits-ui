import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		container: {
			center: true,
			screens: {
				"2xl": "1440px",
			},
		},
		extend: {
			colors: {
				border: {
					DEFAULT: "hsl(var(--border-card))",
					input: "hsl(var(--border-input))",
					"input-hover": "hsl(var(--border-input-hover))",
				},
				background: {
					DEFAULT: "hsl(var(--background) / <alpha-value>)",
					alt: "hsl(var(--background-alt) / <alpha-value>)",
				},
				foreground: {
					DEFAULT: "hsl(var(--foreground) / <alpha-value>)",
					alt: "hsl(var(--foreground-alt) / <alpha-value>)",
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground))",
				},
				dark: {
					DEFAULT: "hsl(var(--dark) / <alpha-value>)",
					4: "hsl(var(--dark-04))",
					10: "hsl(var(--dark-10))",
					40: "hsl(var(--dark-40))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
				},
				tertiary: {
					DEFAULT: "hsl(var(--tertiary) / <alpha-value>)",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
				},
				contrast: {
					DEFAULT: "hsl(var(--contrast) / <alpha-value>)",
				},
			},
			fontFamily: {
				sans: ["Inter", ...fontFamily.sans],
				mono: ["Source Code Pro", ...fontFamily.mono],
				alt: ["Courier", ...fontFamily.sans],
			},
			fontSize: {
				xxs: "10px",
			},
			borderWidth: {
				6: "6px",
			},
			borderRadius: {
				card: "16px",
				"card-lg": "20px",
				"card-sm": "10px",
				input: "9px",
				button: "5px",
				"5px": "5px",
				"9px": "9px",
				"10px": "10px",
				"15px": "15px",
			},
			height: {
				input: "3rem",
				"input-sm": "2.5rem",
			},
			boxShadow: {
				mini: "var(--shadow-mini)",
				"mini-inset": "var(--shadow-mini-inset)",
				popover: "var(--shadow-popover)",
				kbd: "var(--shadow-kbd)",
				btn: "var(--shadow-btn)",
				card: "var(--shadow-card)",
				"date-field-focus": "var(--shadow-date-field-focus)",
			},
			opacity: {
				8: "0.08",
			},
			scale: {
				80: ".80",
				98: ".98",
				99: ".99",
			},
		},
		keyframes: {
			"accordion-down": {
				from: { height: "0" },
				to: { height: "var(--bits-accordion-content-height)" },
			},
			"accordion-up": {
				from: { height: "var(--bits-accordion-content-height)" },
				to: { height: "0" },
			},
			"caret-blink": {
				"0%,70%,100%": { opacity: "1" },
				"20%,50%": { opacity: "0" },
			},
			enterFromRight: {
				from: { opacity: "0", transform: "translateX(200px)" },
				to: { opacity: "1", transform: "translateX(0)" },
			},
			enterFromLeft: {
				from: { opacity: "0", transform: "translateX(-200px)" },
				to: { opacity: "1", transform: "translateX(0)" },
			},
			exitToRight: {
				from: { opacity: "1", transform: "translateX(0)" },
				to: { opacity: "0", transform: "translateX(200px)" },
			},
			exitToLeft: {
				from: { opacity: "1", transform: "translateX(0)" },
				to: { opacity: "0", transform: "translateX(-200px)" },
			},
			scaleIn: {
				from: { opacity: "0", transform: "rotateX(-10deg) scale(0.9)" },
				to: { opacity: "1", transform: "rotateX(0deg) scale(1)" },
			},
			scaleOut: {
				from: { opacity: "1", transform: "rotateX(0deg) scale(1)" },
				to: { opacity: "0", transform: "rotateX(-10deg) scale(0.95)" },
			},
			fadeIn: {
				from: { opacity: "0" },
				to: { opacity: "1" },
			},
			fadeOut: {
				from: { opacity: "1" },
				to: { opacity: "0" },
			},
		},
		animation: {
			"accordion-down": "accordion-down 0.2s ease-out",
			"accordion-up": "accordion-up 0.2s ease-out",
			"caret-blink": "caret-blink 1.25s ease-out infinite",
			scaleIn: "scaleIn 200ms ease",
			scaleOut: "scaleOut 150ms ease",
			fadeIn: "fadeIn 200ms ease",
			fadeOut: "fadeOut 150ms ease",
			enterFromLeft: "enterFromLeft 200ms ease",
			enterFromRight: "enterFromRight 200ms ease",
			exitToLeft: "exitToLeft 200ms ease",
			exitToRight: "exitToRight 200ms ease",
		},
	},
	plugins: [
		typography,
		animate,
		plugin(({ matchUtilities }) => {
			matchUtilities({
				perspective: (value) => ({
					perspective: value,
				}),
			});
		}),
	],
};
