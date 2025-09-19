<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { ToolbarButtonProps } from "../types.js";
	import { ToolbarButtonState } from "../toolbar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		children,
		disabled = false,
		type = "button",
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: ToolbarButtonProps = $props();

	const buttonState = ToolbarButtonState.create({
		id: boxWith(() => id),
		disabled: boxWith(() => disabled ?? false),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, buttonState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
