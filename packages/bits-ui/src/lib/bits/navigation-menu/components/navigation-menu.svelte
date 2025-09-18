<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { NavigationMenuRootProps } from "../types.js";
	import { NavigationMenuRootState } from "../navigation-menu.svelte.js";
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
		delayDuration = 200,
		skipDelayDuration = 300,
		dir = "ltr",
		orientation = "horizontal",
		...restProps
	}: NavigationMenuRootProps = $props();

	const rootState = NavigationMenuRootState.create({
		id: boxWith(() => id),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		delayDuration: boxWith(() => delayDuration),
		skipDelayDuration: boxWith(() => skipDelayDuration),
		dir: boxWith(() => dir),
		orientation: boxWith(() => orientation),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps({ "aria-label": "main" }, restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<nav {...mergedProps}>
		{@render children?.()}
	</nav>
{/if}
