<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useToggleRoot } from "../toggle.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		child,
		children,
		ref = $bindable(null),
		id = useId(),
		pressed = $bindable(false),
		onPressedChange,
		disabled = false,
		type = "button",
		...restProps
	}: RootProps = $props();

	const toggleState = useToggleRoot({
		pressed: box.with(
			() => pressed,
			(v) => {
				if (pressed !== v) {
					pressed = v;
					onPressedChange?.(v);
				}
			}
		),
		disabled: box.with(() => disabled),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, toggleState.props, { type }));
</script>

{#if child}
	{@render child?.({ props: mergedProps, pressed: toggleState.pressed.current })}
{:else}
	<button {...mergedProps}>
		{@render children?.({ pressed: toggleState.pressed.current })}
	</button>
{/if}
