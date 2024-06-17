<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setLabelRootState } from "../label.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";

	let {
		asChild,
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		for: forProp,
		...restProps
	}: RootProps = $props();

	const rootState = setLabelRootState({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, rootState.props, { for: forProp }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<label {...mergedProps} for={forProp}>
		{@render children?.()}
	</label>
{/if}
