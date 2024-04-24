<script lang="ts">
	import type { ButtonProps } from "../index.js";
	import { setToolbarButtonState } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		child,
		children,
		disabled = false,
		type = "button",
		id = useId(),
		el = $bindable(),
		...restProps
	}: ButtonProps = $props();

	const state = setToolbarButtonState({
		id: readonlyBox(() => id),
		disabled: readonlyBox(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
