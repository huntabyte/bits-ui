<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { DialogCloseState } from "../dialog.svelte.js";
	import type { DialogCloseProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		disabled = false,
		...restProps
	}: DialogCloseProps = $props();

	const closeState = DialogCloseState.create({
		variant: boxWith(() => "close"),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		disabled: boxWith(() => Boolean(disabled)),
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
