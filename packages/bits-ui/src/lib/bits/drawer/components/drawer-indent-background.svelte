<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { DrawerIndentBackgroundState } from "../drawer.svelte.js";
	import type { DrawerIndentBackgroundProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: DrawerIndentBackgroundProps = $props();

	const backgroundState = DrawerIndentBackgroundState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, backgroundState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
