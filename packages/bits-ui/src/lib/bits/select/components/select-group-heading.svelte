<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { SelectGroupHeadingProps } from "../types.js";
	import { SelectGroupHeadingState } from "../select.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();
	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: SelectGroupHeadingProps = $props();

	const groupHeadingState = SelectGroupHeadingState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupHeadingState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
