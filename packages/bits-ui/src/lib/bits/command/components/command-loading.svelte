<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { CommandLoadingProps } from "../types.js";
	import { CommandLoadingState } from "../command.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		progress = 0,
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: CommandLoadingProps = $props();

	const loadingState = CommandLoadingState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		progress: boxWith(() => progress),
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
