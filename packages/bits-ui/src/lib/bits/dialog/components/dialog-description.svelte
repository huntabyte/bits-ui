<script lang="ts">
	import { setDialogDescriptionState } from "../dialog.svelte.js";
	import type { DescriptionProps } from "../index.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		id = useId(),
		asChild,
		children,
		child,
		el = $bindable(),
		...restProps
	}: DescriptionProps = $props();

	const state = setDialogDescriptionState({
		id: readonlyBox(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
