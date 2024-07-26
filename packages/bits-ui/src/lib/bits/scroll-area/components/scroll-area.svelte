<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useScrollAreaRoot } from "../scroll-area.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		ref = $bindable(null),
		id = useId(),
		type = "hover",
		dir = "ltr",
		scrollHideDelay = 600,
		children,
		child,
		...restProps
	}: RootProps = $props();

	const rootState = useScrollAreaRoot({
		type: box.with(() => type),
		dir: box.with(() => dir),
		scrollHideDelay: box.with(() => scrollHideDelay),
		id: box.with(() => id),
		ref: box.with(
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
