<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useProgressRootState } from "../progress.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		child,
		children,
		value = 0,
		max = 100,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: RootProps = $props();

	const rootState = useProgressRootState({
		value: box.with(() => value),
		max: box.with(() => max),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
