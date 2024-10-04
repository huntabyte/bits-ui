<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ToggleRootProps } from "../types.js";
	import { useToggleRoot } from "../toggle.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		ref = $bindable(null),
		id = useId(),
		pressed = $bindable(false),
		onPressedChange = noop,
		disabled = false,
		type = "button",
		controlledPressed = false,
		children,
		child,
		...restProps
	}: ToggleRootProps = $props();

	const toggleState = useToggleRoot({
		pressed: box.with(
			() => pressed,
			(v) => {
				if (controlledPressed) {
					onPressedChange(v);
				} else {
					pressed = v;
					onPressedChange(v);
				}
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
	{@render child({ props: mergedProps, pressed: toggleState.pressed.current })}
{:else}
	<button {...mergedProps}>
		{@render children?.({ pressed: toggleState.pressed.current })}
	</button>
{/if}
