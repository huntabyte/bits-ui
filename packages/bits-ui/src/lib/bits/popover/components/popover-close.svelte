<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { PopoverCloseProps } from "../types.js";
	import { PopoverCloseState } from "../popover.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: PopoverCloseProps = $props();

	const closeState = PopoverCloseState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, closeState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
