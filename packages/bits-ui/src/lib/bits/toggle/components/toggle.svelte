<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { ToggleRootProps } from "../types.js";
	import { ToggleRootState } from "../toggle.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		pressed = $bindable(false),
		onPressedChange = noop,
		disabled = false,
		type = "button",
		children,
		child,
		...restProps
	}: ToggleRootProps = $props();

	const toggleState = ToggleRootState.create({
		pressed: boxWith(
			() => pressed,
			(v) => {
				pressed = v;
				onPressedChange(v);
			}
		),
		disabled: boxWith(() => disabled ?? false),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, toggleState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps, ...toggleState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(toggleState.snippetProps)}
	</button>
{/if}
