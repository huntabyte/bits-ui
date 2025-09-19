<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
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
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		id: boxWith(() => id),
		decorative: boxWith(() => decorative),
		orientation: boxWith(() => orientation),
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
