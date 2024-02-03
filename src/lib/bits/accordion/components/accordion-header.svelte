<script lang="ts">
	import { verifyContextDeps } from "$lib/internal/index.js";
	import { ACCORDION_ITEM } from "../state.svelte.js";
	import type { AccordionHeaderProps } from "../types.js";

	let { asChild = false, level = 2, children, child, ...rest } = $props<AccordionHeaderProps>();

	verifyContextDeps(ACCORDION_ITEM);

	let attrs = $derived({
		role: "heading",
		"aria-level": level,
		"data-heading-level": level,
	});
</script>

{#if asChild && child}
	{@render child({ ...rest, ...attrs })}
{:else}
	<div {...rest} {...attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
