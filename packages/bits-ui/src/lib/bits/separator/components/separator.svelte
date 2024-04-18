<script lang="ts">
	import { setSeparatorRootState } from "../separator.svelte.js";
	import type { RootProps } from "../index.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		asChild,
		child,
		children,
		decorative: decorativeProp = false,
		orientation: orientationProp = "horizontal",
		el = $bindable(),
		style = {},
		...restProps
	}: RootProps = $props();

	const decorative = readonlyBox(() => decorativeProp);
	const orientation = readonlyBox(() => orientationProp);

	const separator = setSeparatorRootState({ decorative, orientation });

	const mergedProps = $derived({
		...restProps,
		...separator.props,
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
