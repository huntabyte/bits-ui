<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { MenuGroupHeadingProps } from "../types.js";
	import { MenuGroupHeadingState } from "../menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: MenuGroupHeadingProps = $props();

	const groupHeadingState = MenuGroupHeadingState.create({
		id: box.with(() => id),
		ref: box.with(
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
