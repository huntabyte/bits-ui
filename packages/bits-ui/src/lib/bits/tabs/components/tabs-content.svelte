<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TabsContentProps } from "../types.js";
	import { TabsContentState } from "../tabs.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		value,
		...restProps
	}: TabsContentProps = $props();

	const contentState = TabsContentState.create({
		value: box.with(() => value),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
