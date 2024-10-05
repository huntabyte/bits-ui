<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useSeparatorRoot } from "../separator.svelte.js";
	import type { SeparatorRootProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { mergeProps } from "$lib/internal/merge-props.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		decorative = false,
		orientation = "horizontal",
		...restProps
	}: SeparatorRootProps = $props();

	const rootState = useSeparatorRoot({
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		id: box.with(() => id),
		decorative: box.with(() => decorative),
		orientation: box.with(() => orientation),
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
