<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuItemProps } from "../types.js";
	import { useNavigationMenuItem } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		value = useId(),
		ref = $bindable(null),
		child,
		children,
		openOnHover = true,
		...restProps
	}: NavigationMenuItemProps = $props();

	const itemState = useNavigationMenuItem({
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
