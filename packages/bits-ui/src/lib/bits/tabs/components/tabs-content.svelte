<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TabsContentProps } from "../types.js";
	import { useTabsContent } from "../tabs.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		value,
		...restProps
	}: TabsContentProps = $props();

	const contentState = useTabsContent({
		value: box.with(() => value),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
