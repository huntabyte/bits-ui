<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setLabelRootState } from "../label.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		onmousedown: onmousedownProp = () => {},
		asChild,
		children,
		child,
		el = $bindable(),
		style,
		for: forProp,
		...restProps
	}: RootProps = $props();

	const onmousedown = readonlyBox(() => onmousedownProp);

	const rootState = setLabelRootState({ onmousedown });
	const mergedProps = $derived({
		...restProps,
		...rootState.props,
		style: styleToString(style),
		for: forProp,
	} as const);
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<label bind:this={el} {...mergedProps} for={forProp}>
		{@render children?.()}
	</label>
{/if}
