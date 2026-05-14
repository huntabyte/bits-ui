<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/styles.js";
	import HeadingAnchor from "./heading-anchor.svelte";

	let {
		class: className,
		children,
		id,
		...restProps
	}: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h2
	class={cn(
		"mt-12 scroll-m-[70px] text-[27px] font-semibold tracking-[-0.01em] first:mt-0",
		className
	)}
	{id}
	{...restProps}
>
	<HeadingAnchor {id}>
		{@render children?.()}
	</HeadingAnchor>
</h2>
