<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { ProgressRootProps } from "../types.js";
	import { ProgressRootState } from "../progress.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		children,
		value = 0,
		max = 100,
		min = 0,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: ProgressRootProps = $props();

	const rootState = ProgressRootState.create({
		value: box.with(() => value),
		max: box.with(() => max),
		min: box.with(() => min),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
