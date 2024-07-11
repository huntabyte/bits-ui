<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useSeparatorRoot } from "../separator.svelte.js";
	import type { RootProps } from "../index.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		child,
		children,
		decorative = false,
		orientation = "horizontal",
		ref = $bindable(),
		style = {},
		...restProps
	}: RootProps = $props();

	const rootState = useSeparatorRoot({
		decorative: box.with(() => decorative),
		orientation: box.with(() => orientation),
	});

	const mergedProps = $derived({
		...restProps,
		...rootState.props,
		style: styleToString(style),
	});
</script>

{#if child}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
