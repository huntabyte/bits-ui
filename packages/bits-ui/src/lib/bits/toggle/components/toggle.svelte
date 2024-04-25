<script lang="ts">
	import type { RootProps } from "../index.js";
	import { useToggleRoot } from "../toggle.svelte.js";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
		pressed = $bindable(false),
		onPressedChange,
		disabled = false,
		type = "button",
		...restProps
	}: RootProps = $props();

	const state = useToggleRoot({
		pressed: box(
			() => pressed,
			(v) => {
				if (pressed !== v) {
					pressed = v;
					onPressedChange?.(v);
				}
			}
		),
		disabled: readonlyBox(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, pressed: state.pressed.value })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
