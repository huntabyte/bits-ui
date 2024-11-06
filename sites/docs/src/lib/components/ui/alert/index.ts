import { type VariantProps, tv } from "tailwind-variants";

import Root from "./alert.svelte";
import Description from "./alert-description.svelte";
import Title from "./alert-title.svelte";

export const alertVariants = tv({
	base: "relative w-full rounded-[16px] p-5 [&>h5]:tracking-normal ",

	variants: {
		variant: {
			note: "dark:[&>h5]:[#363661] bg-[#E0F2FE] text-[#363661] dark:bg-[#E0F2FE] [&>.dot]:bg-[#363661] [&>h5]:text-[#363661] [&>svg]:text-sky-600 dark:[&>svg]:text-sky-400",
			danger: "border-rose-200 bg-rose-50 text-foreground dark:border-rose-600 dark:bg-rose-500/20 [&>h5]:text-red-600 dark:[&>h5]:text-red-300 [&>svg]:text-red-800 dark:[&>svg]:text-red-300",
			tip: "dark:[&>h5]:[#0040A7] bg-[#FFDFDA] text-[#0040A7] dark:bg-[#FFDFDA] [&>.dot]:bg-[#0040A7] [&>h5]:text-[#0040A7]",
			warning:
				"bg-[#FEFCE8] text-[#525252] dark:bg-[#FEFCE8] [&>.dot]:bg-[#525252] [&>h5]:text-[#525252] dark:[&>h5]:text-[#525252]",
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
