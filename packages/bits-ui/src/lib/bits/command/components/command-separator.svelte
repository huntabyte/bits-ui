<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { CommandSeparatorProps } from "../types.js";
	import { CommandSeparatorState } from "../command.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		children,
		child,
		...restProps
	}: CommandSeparatorProps = $props();

	const separatorState = CommandSeparatorState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		forceMount: boxWith(() => forceMount),
	});

	const mergedProps = $derived(mergeProps(restProps, separatorState.props));
</script>

{#if separatorState.shouldRender}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
