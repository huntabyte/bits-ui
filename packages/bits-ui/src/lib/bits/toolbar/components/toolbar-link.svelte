<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { ToolbarLinkState } from "../toolbar.svelte.js";
	import type { ToolbarLinkProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		href,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: ToolbarLinkProps = $props();

	const linkState = ToolbarLinkState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, linkState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<a {href} {...mergedProps}>
		{@render children?.()}
	</a>
{/if}
