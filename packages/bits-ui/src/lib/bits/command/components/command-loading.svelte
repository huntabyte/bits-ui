<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { CommandLoadingProps } from "../types.js";
	import { useCommandLoading } from "../command.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		progress = 0,
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: CommandLoadingProps = $props();

	const loadingState = useCommandLoading({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		progress: box.with(() => progress),
	});

	const mergedProps = $derived(mergeProps(restProps, loadingState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
