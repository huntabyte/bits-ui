<script lang="ts" context="module">
	import type { Snippet } from "svelte";

	type Props = {
		asChild?: boolean;
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		children?: Snippet
	};
</script>

<script lang="ts">
	let { asChild = false, level = 2, children, ...rest } = $props<Props>();

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
