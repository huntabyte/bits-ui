<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useSeparatorRoot } from "../separator.svelte.js";
	import type { RootProps } from "../index.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		asChild,
		child,
		children,
		decorative = false,
		orientation = "horizontal",
		el = $bindable(),
		style = {},
		...restProps
	}: RootProps = $props();

	const state = useSeparatorRoot({
		decorative: box.with(() => decorative),
		orientation: box.with(() => orientation),
	});

	const mergedProps = $derived({
		...restProps,
		...state.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
