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

<h4
	class={cn("-mb-2 mt-8 scroll-m-20 text-lg font-bold tracking-tight", className)}
	{id}
	{...restProps}
>
	<HeadingAnchor {id}>
		{@render children?.()}
	</HeadingAnchor>
</h4>
