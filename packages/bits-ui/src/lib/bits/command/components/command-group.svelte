<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CommandGroupProps } from "../types.js";
	import { CommandGroupContainerState } from "../command.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = "",
		forceMount = false,
		children,
		child,
		...restProps
	}: CommandGroupProps = $props();

	const groupState = CommandGroupContainerState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		forceMount: box.with(() => forceMount),
		value: box.with(() => value),
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
