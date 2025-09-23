<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { CommandGroupHeadingState } from "../command.svelte.js";
	import type { CommandGroupHeadingProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: CommandGroupHeadingProps = $props();

	const headingState = CommandGroupHeadingState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headingState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
