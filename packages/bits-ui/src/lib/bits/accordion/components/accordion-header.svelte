<script lang="ts">
	import type { AccordionHeaderProps } from "../types.js";

	let { asChild, level = 2, children, child, ...restProps }: AccordionHeaderProps = $props();

	const mergedProps = $derived({
		...restProps,
		role: "heading",
		"aria-level": level,
		"data-heading-level": level,
	});
</script>

{#if asChild && child}
	{@render child(mergedProps)}
{:else}
	<div {...mergedProps}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
