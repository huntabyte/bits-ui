import { tv } from "tailwind-variants";

/**
 * hover:button-gradient inline-flex h-12 items-center justify-center rounded-input
		bg-dark px-[21px] text-[15px] font-semibold text-background
		shadow-mini outline-hidden ring-dark ring-offset-4 ring-offset-background transition-all focus:ring-1
 */

export const buttonVariants = tv({
	base: "ring-offset-background focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "text-destructive-foreground bg-destructive hover:bg-destructive/90",
			outline:
				"border-input bg-background hover:bg-accent hover:text-accent-foreground border",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
		},
		size: {
			default: "h-12 rounded-[9px] px-[21px] py-4 text-[15px]",
			sm: "h-8 rounded-md px-3",
			lg: "h-11 rounded-md px-8",
			icon: "h-10 w-10",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});
