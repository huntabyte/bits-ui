<script lang="ts">
	import type { AccordionHeaderProps } from "./types.js";

	let {
		asChild = false,
		level = 2,
		children,
		...rest
	} = $props<AccordionHeaderProps>();

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
