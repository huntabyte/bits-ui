<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SelectIconProps } from "../types.js";
	import { useSelectIcon } from "../select.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: SelectIconProps = $props();

	const iconState = useSelectIcon({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, iconState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{#if children}
			{@render children()}
		{:else}
			▼
		{/if}
	</span>
{/if}
