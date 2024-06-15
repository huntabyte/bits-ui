<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TriggerProps } from "../index.js";
	import { useNavigationMenuTrigger } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import VisuallyHidden from "$lib/bits/utilities/visually-hidden/visually-hidden.svelte";

	let {
		id = useId(),
		disabled = false,
		asChild,
		children,
		child,
		ref = $bindable(),
		...restProps
	}: TriggerProps = $props();

	const triggerState = useNavigationMenuTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</button>
{/if}

{#if triggerState.open}
	<VisuallyHidden {...triggerState.visuallyHiddenProps} />
	{#if triggerState.menu.viewportId.value}
		<span aria-owns={triggerState.item.contentId.value}></span>
	{/if}
{/if}
