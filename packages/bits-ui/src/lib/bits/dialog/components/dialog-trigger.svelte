<script lang="ts">
	import { setDialogTriggerState } from "../dialog.svelte.js";
	import type { TriggerProps } from "../index.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		id = useId(),
		el = $bindable(),
		asChild,
		children,
		child,
		...restProps
	}: TriggerProps = $props();

	const state = setDialogTriggerState({
		id: readonlyBox(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button {...mergedProps} bind:this={el}>
		{@render children?.()}
	</button>
{/if}
