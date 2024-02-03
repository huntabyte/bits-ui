<script lang="ts">
	import { verifyContextDeps } from "$lib/internal/index.js";
	import { ACCORDION_ITEM } from "../state.svelte.js";
	import type { AccordionHeaderProps } from "../types.js";

	let { asChild = false, level = 2, children, child, ...props } = $props<AccordionHeaderProps>();

	verifyContextDeps(ACCORDION_ITEM);

	let attrs = $derived({
		role: "heading",
		"aria-level": level,
		"data-heading-level": level,
	});
</script>

{#if asChild && child}
	{@render child({ ...props, ...attrs })}
{:else}
	<div {...props} {...attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
