<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { SeparatorRootState } from "../separator.svelte.js";
	import type { SeparatorRootProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		decorative = false,
		orientation = "horizontal",
		...restProps
	}: SeparatorRootProps = $props();

	const rootState = SeparatorRootState.create({
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		id: box.with(() => id),
		decorative: box.with(() => decorative),
		orientation: box.with(() => orientation),
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
