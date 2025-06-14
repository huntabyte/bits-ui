<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuItemProps } from "../types.js";
	import { NavigationMenuItemState } from "../navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();
	const defaultId = createId(uid);

	let {
		id = defaultId,
		value = defaultId,
		ref = $bindable(null),
		child,
		children,
		openOnHover = true,
		...restProps
	}: NavigationMenuItemProps = $props();

	const itemState = NavigationMenuItemState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(() => value),
		openOnHover: box.with(() => openOnHover),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<li {...mergedProps}>
		{@render children?.()}
	</li>
{/if}
