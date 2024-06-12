<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useToggleRoot } from "../toggle.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		child,
		children,
		ref = $bindable(),
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
	});

	const mergedProps = $derived(mergeProps(restProps, toggleState.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, pressed: toggleState.pressed.value })}
{:else}
	<button bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
