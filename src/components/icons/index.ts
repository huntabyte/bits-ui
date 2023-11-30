import type { HTMLAttributes } from "svelte/elements";

export { default as GitHub } from "./github.svelte";
export { default as Xcom } from "./x-com.svelte";
export { default as Tailwind } from "./tailwind.svelte";
export { default as Aria } from "./aria.svelte";
export { default as Npm } from "./npm.svelte";
export { default as Pnpm } from "./pnpm.svelte";
export { default as Yarn } from "./yarn.svelte";
export { default as SwitchOn } from "./switch-on.svelte";
export { default as SwitchOff } from "./switch-off.svelte";
export { default as Logo } from "./logo.svelte";

export type IconProps = Partial<HTMLAttributes<SVGElement>> & {
	class?: string;
};
