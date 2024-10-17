import { type VariantProps, tv } from "tailwind-variants";

import Root from "./alert.svelte";
import Description from "./alert-description.svelte";
import Title from "./alert-title.svelte";

export const alertVariants = tv({
	base: "relative w-full rounded-br-lg rounded-tr-lg border-l-4 px-4 pb-4 pt-[22px] [&>h5]:tracking-normal [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-6 [&>svg]:text-foreground",

	variants: {
		variant: {
			note: "border-sky-200 bg-sky-50 text-foreground dark:border-sky-600 dark:bg-sky-500/15 [&>h5]:text-sky-600 dark:[&>h5]:text-sky-400 [&>svg]:text-sky-600 dark:[&>svg]:text-sky-400",
			danger: "border-rose-200 bg-rose-50 text-foreground dark:border-rose-600 dark:bg-rose-500/20 [&>h5]:text-red-600 dark:[&>h5]:text-red-300 [&>svg]:text-red-800 dark:[&>svg]:text-red-300",
			tip: "border-fuchsia-200 bg-fuchsia-50 text-foreground dark:border-fuchsia-700 dark:bg-fuchsia-500/15 [&>h5]:text-fuchsia-500 dark:[&>h5]:text-fuchsia-500 [&>svg]:text-fuchsia-500 dark:[&>svg]:text-fuchsia-500",
			warning:
				"border-amber-200 bg-amber-50 text-foreground dark:border-amber-600 dark:bg-amber-500/15 [&>h5]:text-amber-500 dark:[&>h5]:text-amber-400 [&>svg]:text-amber-500 dark:[&>svg]:text-amber-400",
		},
	},
	defaultVariants: {
		variant: "note",
	},
});

export type Variant = VariantProps<typeof alertVariants>["variant"];
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export {
	Root,
	Description,
	Title,
	//
	Root as Alert,
	Description as AlertDescription,
	Title as AlertTitle,
};
