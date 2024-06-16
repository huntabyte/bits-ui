<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TriggerProps } from "../index.js";
	import { useNavigationMenuTrigger } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import VisuallyHidden from "$lib/bits/utilities/visually-hidden/visually-hidden.svelte";
	import Mounted from "$lib/bits/utilities/mounted.svelte";

	let {
		id = useId(),
		disabled = false,
		asChild,
		children,
		child,
		ref = $bindable(null),
		...restProps
	}: TriggerProps = $props();

	let focusProxyMounted = $state(false);

	const triggerState = useNavigationMenuTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		focusProxyMounted: box.with(() => focusProxyMounted),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}

{#if triggerState.open}
	<Mounted bind:isMounted={focusProxyMounted} />
	<VisuallyHidden {...triggerState.visuallyHiddenProps} />
	{#if triggerState.menu.viewportNode}
		<span aria-owns={triggerState.item.contentNode?.id ?? undefined}></span>
	{/if}
{/if}
