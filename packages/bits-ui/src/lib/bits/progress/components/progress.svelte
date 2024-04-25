<script lang="ts">
	import type { RootProps } from "../index.js";
	import { useProgressRootState } from "../progress.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		child,
		children,
		value = 0,
		max = 100,
		el = $bindable(),
		...restProps
	}: RootProps = $props();

	const state = useProgressRootState({
		value: readonlyBox(() => value),
		max: readonlyBox(() => max),
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
