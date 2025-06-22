<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuSubProps } from "../types.js";
	import { NavigationMenuSubState } from "../navigation-menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(""),
		onValueChange = noop,
		orientation = "horizontal",
		...restProps
	}: NavigationMenuSubProps = $props();

	const rootState = NavigationMenuSubState.create({
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		orientation: box.with(() => orientation),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
