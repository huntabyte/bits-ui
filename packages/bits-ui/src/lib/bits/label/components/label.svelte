<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setLabelRootState } from "../label.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		for: forProp,
		...restProps
	}: RootProps = $props();

	const state = setLabelRootState();
	const mergedProps = $derived(mergeProps(restProps, state.props, { for: forProp }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<label bind:this={el} {...mergedProps} for={forProp}>
		{@render children?.()}
	</label>
{/if}
