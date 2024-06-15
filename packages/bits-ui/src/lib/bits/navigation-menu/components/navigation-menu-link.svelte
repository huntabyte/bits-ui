<script lang="ts">
	import { noop } from "$lib/internal/callbacks.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import type { LinkProps } from "../index.js";
	import { useNavigationMenuLink } from "../navigation-menu.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(),
		asChild,
		child,
		children,
		active = false,
		onSelect = noop,
		...restProps
	}: LinkProps = $props();

	const linkState = useNavigationMenuLink({
		id: box.with(() => id),
		active: box.with(() => active),
		onSelect: box.with(() => onSelect),
	});

	const mergedProps = $derived(mergeProps(restProps, linkState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<a {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</a>
{/if}
