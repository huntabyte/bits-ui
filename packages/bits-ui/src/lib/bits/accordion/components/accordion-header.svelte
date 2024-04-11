<script lang="ts">
	import { ACCORDION_ITEM } from "../state.svelte.js";
	import type { AccordionHeaderProps } from "../types.js";
	import { verifyContextDeps } from "$lib/internal/index.js";

	let { asChild, level = 2, children, child, ...restProps }: AccordionHeaderProps = $props();

	verifyContextDeps(ACCORDION_ITEM);

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
