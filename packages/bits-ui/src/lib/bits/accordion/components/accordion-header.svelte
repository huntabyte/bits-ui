<script lang="ts">
	import type { AccordionHeaderProps } from "../types.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		asChild,
		level = 2,
		children,
		child,
		el = $bindable(),
		style = {},
		...restProps
	}: AccordionHeaderProps = $props();

	const mergedProps = $derived({
		...restProps,
		role: "heading",
		"aria-level": level,
		"data-heading-level": level,
		style: styleToString(style),
		"data-accordion-header": "",
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
