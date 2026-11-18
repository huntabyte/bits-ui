<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "#lib/utils/styles.js";
	import HeadingAnchor from "./heading-anchor.svelte";

	let {
		class: className,
		children,
		id,
		...restProps
	}: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h4
	class={cn("mt-8 -mb-2 scroll-m-20 text-lg font-bold tracking-tight", className)}
	{id}
	{...restProps}
>
	<HeadingAnchor id={id ?? undefined}>
		{@render children?.()}
	</HeadingAnchor>
</h4>
