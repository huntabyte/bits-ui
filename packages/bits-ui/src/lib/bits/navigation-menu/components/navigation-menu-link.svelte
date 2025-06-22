<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuLinkProps } from "../types.js";
	import { NavigationMenuLinkState } from "../navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		active = false,
		onSelect = noop,
		tabindex = 0,
		...restProps
	}: NavigationMenuLinkProps = $props();

	const linkState = NavigationMenuLinkState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		active: box.with(() => active),
		onSelect: box.with(() => onSelect),
	});

	const mergedProps = $derived(mergeProps(restProps, linkState.props, { tabindex }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a {...mergedProps}>
		{@render children?.()}
	</a>
{/if}
