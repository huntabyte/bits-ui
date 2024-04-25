<script lang="ts">
	import { useSeparatorRoot } from "../separator.svelte.js";
	import type { RootProps } from "../index.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
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
		decorative: readonlyBox(() => decorative),
		orientation: readonlyBox(() => orientation),
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
