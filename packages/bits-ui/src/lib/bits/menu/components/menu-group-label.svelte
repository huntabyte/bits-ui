<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { GroupLabelProps } from "../index.js";
	import { useMenuLabel } from "../menu.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: GroupLabelProps = $props();

	const groupLabelState = useMenuLabel({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, groupLabelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
