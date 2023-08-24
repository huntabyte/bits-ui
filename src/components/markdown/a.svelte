<script lang="ts">
	import { cn } from "@/utils";

	let className: string | undefined | null = undefined;
	export { className as class };
	export let href: string;
	$: internal = href.startsWith("/") || href.startsWith("#");

	$: rel = !internal ? "noopener noreferrer" : undefined;
	$: target = !internal ? "_blank" : undefined;
</script>

<a
	{href}
	{target}
	{rel}
	class={cn("inline-flex items-center gap-1 font-medium underline underline-offset-4", className)}
	{...$$restProps}
>
	<slot />
</a>
