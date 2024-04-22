<script lang="ts">
	import type { ContentProps } from "../index.js";
	import { setTabsContentState } from "../tabs.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		value,
		...restProps
	}: ContentProps = $props();

	const state = setTabsContentState({
		value: readonlyBox(() => value),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
