<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { DialogTriggerState } from "../dialog.svelte.js";
	import type { DialogTriggerProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		disabled = false,
		...restProps
	}: DialogTriggerProps = $props();

	const triggerState = DialogTriggerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		disabled: boxWith(() => Boolean(disabled)),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
