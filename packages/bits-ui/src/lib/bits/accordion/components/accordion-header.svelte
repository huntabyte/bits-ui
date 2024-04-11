<script lang="ts">
	import { verifyContextDeps } from "$lib/internal/index.js";
	import { ACCORDION_ITEM } from "../state.svelte.js";
	import type { AccordionHeaderProps } from "../types.js";

	let { asChild, level = 2, children, child, ...props }: AccordionHeaderProps = $props();

	verifyContextDeps(ACCORDION_ITEM);

	const mergedProps = $derived({
		...props,
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
