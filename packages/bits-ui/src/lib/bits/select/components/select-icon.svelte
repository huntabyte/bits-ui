<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { IconProps } from "../index.js";
	import { useSelectIcon } from "../select.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: IconProps = $props();

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
