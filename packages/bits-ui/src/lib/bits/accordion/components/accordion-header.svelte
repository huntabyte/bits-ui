<script lang="ts">
	import type { AccordionHeaderProps } from "../types.js";

	let {
		asChild,
		level = 2,
		children,
		child,
		el = $bindable(),
		...restProps
	}: AccordionHeaderProps = $props();

	const mergedProps = $derived({
		...restProps,
		role: "heading",
		"aria-level": level,
		"data-heading-level": level,
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
