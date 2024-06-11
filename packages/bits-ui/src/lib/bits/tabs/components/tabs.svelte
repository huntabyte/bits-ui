<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useTabsRoot } from "../tabs.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		id = useId(),
		value = $bindable(""),
		onValueChange,
		orientation = "horizontal",
		loop = true,
		activationMode = "automatic",
		disabled = false,
		...restProps
	}: RootProps = $props();

	const rootState = useTabsRoot({
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				if (value !== v) {
					value = v;
					onValueChange?.(v);
				}
			}
		),
		orientation: box.with(() => orientation),
		loop: box.with(() => loop),
		activationMode: box.with(() => activationMode),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
