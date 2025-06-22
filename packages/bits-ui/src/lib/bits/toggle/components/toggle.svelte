<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
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
		pressed: box.with(
			() => pressed,
			(v) => {
				pressed = v;
				onPressedChange(v);
			}
		),
		disabled: box.with(() => disabled ?? false),
		id: box.with(() => id),
		ref: box.with(
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
