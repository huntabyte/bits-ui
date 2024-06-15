<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useNavigationMenuRoot } from "../navigation-menu.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		child,
		children,
		id = useId(),
		ref = $bindable(),
		value = $bindable(""),
		onValueChange = noop,
		delayDuration = 200,
		skipDelayDuration = 300,
		dir = "ltr",
		orientation = "horizontal",
		...restProps
	}: RootProps = $props();

	const rootState = useNavigationMenuRoot({
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				if (v !== value) {
					value = v;
					onValueChange(v);
				}
			}
		),
		delayDuration: box.with(() => delayDuration),
		skipDelayDuration: box.with(() => skipDelayDuration),
		dir: box.with(() => dir),
		orientation: box.with(() => orientation),
	});

	const mergedProps = $derived(mergeProps({ "aria-label": "main" }, restProps, rootState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<nav {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</nav>
{/if}
