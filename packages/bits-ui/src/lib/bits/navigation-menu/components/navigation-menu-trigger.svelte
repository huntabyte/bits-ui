<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuTriggerProps } from "../types.js";
	import { NavigationMenuTriggerState } from "../navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import VisuallyHidden from "$lib/bits/utilities/visually-hidden/visually-hidden.svelte";
	import Mounted from "$lib/bits/utilities/mounted.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		disabled = false,
		children,
		child,
		ref = $bindable(null),
		tabindex = 0,
		...restProps
	}: NavigationMenuTriggerProps = $props();

	const triggerState = NavigationMenuTriggerState.create({
		id: box.with(() => id),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { tabindex }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}

{#if triggerState.open}
	<VisuallyHidden {...triggerState.focusProxyProps} />
	<Mounted bind:mounted={triggerState.focusProxyMounted} />
	{#if triggerState.context.viewportRef.current}
		<span aria-owns={triggerState.itemContext.contentId ?? undefined}></span>
	{/if}
{/if}
