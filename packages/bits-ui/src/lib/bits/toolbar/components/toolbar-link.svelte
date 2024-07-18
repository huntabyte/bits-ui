<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useToolbarLink } from "../toolbar.svelte.js";
	import type { LinkProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		children,
		href,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: LinkProps = $props();

	const linkState = useToolbarLink({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, linkState.props));
</script>

{#if child}
	{@render child?.({ props: mergedProps })}
{:else}
	<a {href} {...mergedProps}>
		{@render children?.()}
	</a>
{/if}
