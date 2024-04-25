<script lang="ts">
	import { useDialogTitle } from "../dialog.svelte.js";
	import type { TitleProps } from "../index.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		id = useId(),
		el = $bindable(),
		asChild,
		child,
		children,
		level = 2,
		...restProps
	}: TitleProps = $props();

	const state = useDialogTitle({
		id: readonlyBox(() => id),
		level: readonlyBox(() => level),
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
