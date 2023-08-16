import type { Icon as LucideIcon } from "lucide-svelte";

export { default as CaretRight } from "./caret-right.svelte";
export { default as SunDim } from "./sun-dim.svelte";
export { default as Sun } from "./sun.svelte";
export { default as MoonStars } from "./moon-stars.svelte";
export { default as GitHub } from "./github.svelte";
export { default as Xcom } from "./x-com.svelte";
export { default as Tailwind } from "./tailwind.svelte";
export { default as Aria } from "./aria.svelte";
export { default as Npm } from "./npm.svelte";
export { default as Pnpm } from "./pnpm.svelte";
export { default as Yarn } from "./yarn.svelte";
import type { HTMLAttributes } from "svelte/elements";

export type IconProps = Partial<HTMLAttributes<SVGElement>> & {
	class?: string;
};

export type Icon = LucideIcon;
