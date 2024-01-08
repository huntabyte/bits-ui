import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import typography from "@tailwindcss/typography";

export default {
	darkMode: "class",
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		container: {
			center: true,
			screens: {
				"2xl": "1440px"
			}
		},
		extend: {
			colors: {
				border: {
					DEFAULT: "hsl(var(--border-card))",
					input: "hsl(var(--border-input))"
				},
				background: {
					DEFAULT: "hsl(var(--background) / <alpha-value>)"
				},
				foreground: {
					DEFAULT: "hsl(var(--foreground) / <alpha-value>)",
					alt: "hsl(var(--foreground-alt) / <alpha-value>)"
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground))"
				},
				dark: {
					DEFAULT: "hsl(var(--dark) / <alpha-value>)",
					4: "hsl(var(--dark-04))",
					10: "hsl(var(--dark-10))",
					40: "hsl(var(--dark-40))"
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)"
				},
				contrast: {
					DEFAULT: "hsl(var(--contrast) / <alpha-value>)"
				}
			},
			fontFamily: {
				sans: ["Inter", ...fontFamily.sans],
				mono: ["Source Code Pro", ...fontFamily.mono],
				alt: ["Courier", ...fontFamily.sans]
			},
			fontSize: {
				xxs: "10px"
			},
			borderWidth: {
				6: "6px"
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
				"15px": "15px"
			},
			height: {
				input: "3rem",
				"input-sm": "2.5rem"
			},
			boxShadow: {
				mini: "var(--shadow-mini)",
				"mini-inset": "var(--shadow-mini-inset)",
				popover: "var(--shadow-popover)",
				kbd: "var(--shadow-kbd)",
				btn: "var(--shadow-btn)",
				card: "var(--shadow-card)"
			},
			opacity: {
				8: "0.08"
			},
			scale: {
				80: ".80",
				98: ".98",
				99: ".99"
			}
		}
	},
	plugins: [
		typography,
		plugin(function ({ theme, matchUtilities }) {
			// Square utility
			matchUtilities(
				{
					sq: (value) => ({
						width: value,
						height: value
					})
				},
				{
					values: theme("spacing")
				}
			);
		})
	]
} satisfies Config;
