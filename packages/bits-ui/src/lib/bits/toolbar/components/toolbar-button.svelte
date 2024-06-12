<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ButtonProps } from "../index.js";
	import { useToolbarButton } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		child,
		children,
		disabled = false,
		type = "button",
		id = useId(),
		ref = $bindable(),
		...restProps
	}: ButtonProps = $props();

	const buttonState = useToolbarButton({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, buttonState.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
