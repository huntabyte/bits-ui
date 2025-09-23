<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { MenuSeparatorProps } from "../types.js";
	import { MenuSeparatorState } from "../menu.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		child,
		children,
		...restProps
	}: MenuSeparatorProps = $props();

	const separatorState = MenuSeparatorState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, separatorState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
