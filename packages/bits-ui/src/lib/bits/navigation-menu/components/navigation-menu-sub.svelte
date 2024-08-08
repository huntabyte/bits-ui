<!-- <script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import type { SubProps } from "../index.js";
	import { useNavigationMenuSub } from "../navigation-menu.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		asChild,
		children,
		child,
		ref = $bindable(null),
		value = $bindable(""),
		orientation = "horizontal",
		onValueChange = noop,
		...restProps
	}: SubProps = $props();

	const subState = useNavigationMenuSub({
		id: box.with(() => id),
		orientation: box.with(() => orientation),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => value,
			(v) => {
				if (v !== value) {
					value = v;
					onValueChange(v);
				}
			}
		),
	});

	const mergedProps = $derived(mergeProps(restProps, subState.props));
</script>

{#if asChild}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if} -->
