<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { ToolbarRootProps } from "../types.js";
	import { ToolbarRootState } from "../toolbar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		orientation = "horizontal",
		loop = true,
		child,
		children,
		...restProps
	}: ToolbarRootProps = $props();

	const rootState = ToolbarRootState.create({
		id: boxWith(() => id),
		orientation: boxWith(() => orientation),
		loop: boxWith(() => loop),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
