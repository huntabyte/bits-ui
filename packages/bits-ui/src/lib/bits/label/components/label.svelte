<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { LabelRootProps } from "../types.js";
	import { LabelRootState } from "../label.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		for: forProp,
		...restProps
	}: LabelRootProps = $props();

	const rootState = LabelRootState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, rootState.props, { for: forProp }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<label {...mergedProps} for={forProp}>
		{@render children?.()}
	</label>
{/if}
