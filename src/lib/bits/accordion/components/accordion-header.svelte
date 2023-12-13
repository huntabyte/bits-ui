<script lang="ts">
	import { verifyContextDeps } from "$lib/internal/new/helpers.js";
	import { ACCORDION_ITEM } from "./state.svelte.js";
	import type { AccordionHeaderProps } from "./types.js";

	let {
		asChild = false,
		level = 2,
		children,
		...rest
	} = $props<AccordionHeaderProps>();

	verifyContextDeps(ACCORDION_ITEM);

	let attrs = $derived({
		role: "heading",
		"aria-level": level,
		"data-heading-level": level
	});
</script>

{#if asChild && children}
	{@render children()}
{:else}
	<div {...rest} {...attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
