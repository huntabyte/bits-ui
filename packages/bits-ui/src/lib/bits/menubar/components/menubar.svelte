<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useMenubarRoot } from "../menubar.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		asChild,
		children,
		child,
		ref = $bindable(null),
		value = "",
		dir = "ltr",
		loop = true,
		onValueChange,
		...restProps
	}: RootProps = $props();

	const rootState = useMenubarRoot({
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				if (v !== value) {
					value = v;
					onValueChange?.(v);
				}
			}
		),
		dir: box.with(() => dir),
		loop: box.with(() => loop),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</div>
{/if}
