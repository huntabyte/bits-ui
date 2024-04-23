<script lang="ts">
	import { setToolbarLinkState } from "../toolbar.svelte.js";
	import type { LinkProps } from "../index.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { useId } from "$lib/internal/use-id.svelte.js";

	let {
		asChild,
		children,
		href,
		child,
		el = $bindable(),
		id = useId(),
		...restProps
	}: LinkProps = $props();

	const state = setToolbarLinkState({
		id: readonlyBox(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<a {href} {...mergedProps} bind:this={el}>
		{@render children?.()}
	</a>
{/if}
