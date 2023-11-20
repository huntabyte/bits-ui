import type { Icon as LucideIcon } from "lucide-svelte";
import type { HTMLAttributes } from "svelte/elements";

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
export { default as Check } from "./check.svelte";
export { default as CopySimple } from "./copy-simple.svelte";
export { default as ArrowSquareOut } from "./arrow-square-out.svelte";
export { default as CaretUpDown } from "./caret-up-down.svelte";
export { default as SquareHalf } from "./square-half.svelte";
export { default as BookOpen } from "./book-open.svelte";
export { default as Code } from "./code.svelte";
export { default as RocketLaunch } from "./rocket-launch.svelte";
export { default as Logo } from "./logo.svelte";

export type IconProps = Partial<HTMLAttributes<SVGElement>> & {
	class?: string;
};

export type Icon = LucideIcon;
