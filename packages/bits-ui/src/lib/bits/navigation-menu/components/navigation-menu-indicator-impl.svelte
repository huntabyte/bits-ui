<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuIndicatorProps } from "../types.js";
	import { NavigationMenuIndicatorImplState } from "../navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: NavigationMenuIndicatorProps = $props();

	const indicatorState = NavigationMenuIndicatorImplState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, indicatorState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
