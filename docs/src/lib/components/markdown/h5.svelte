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

<h5
	class={cn("mt-8 scroll-m-20 text-lg font-semibold tracking-tight", className)}
	{id}
	{...restProps}
>
	<HeadingAnchor {id}>
		{@render children?.()}
	</HeadingAnchor>
</h5>
