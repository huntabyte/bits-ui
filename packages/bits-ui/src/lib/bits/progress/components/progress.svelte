<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setProgressRootState } from "../progress.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		asChild,
		child,
		children,
		value: valueProp = 0,
		max: maxProp = 100,
		el = $bindable(),
		style = {},
		...restProps
	}: RootProps = $props();

	const value = readonlyBox(() => valueProp);
	const max = readonlyBox(() => maxProp);

	const progress = setProgressRootState({ value, max });

	const mergedProps = {
		...restProps,
		...progress.props,
		style: styleToString(style),
	};
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
