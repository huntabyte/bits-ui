<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { DialogOverlayState } from "../dialog.svelte.js";
	import type { DialogOverlayProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		forceMount = false,
		child,
		children,
		ref = $bindable(null),
		...restProps
	}: DialogOverlayProps = $props();

	const overlayState = DialogOverlayState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, overlayState.props));
</script>

{#if overlayState.root.mounted || forceMount}
	{#if child}
		{@render child({ props: mergeProps(mergedProps), ...overlayState.snippetProps })}
	{:else}
		<div {...mergeProps(mergedProps)}>
			{@render children?.(overlayState.snippetProps)}
		</div>
	{/if}
{/if}
