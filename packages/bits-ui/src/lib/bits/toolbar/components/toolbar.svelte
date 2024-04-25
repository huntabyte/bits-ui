<script lang="ts">
	import type { RootProps } from "../index.js";
	import { useToolbarRoot } from "../toolbar.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
		id = useId(),
		orientation = "horizontal",
		loop = true,
		...restProps
	}: RootProps = $props();

	const state = useToolbarRoot({
		id: readonlyBox(() => id),
		orientation: readonlyBox(() => orientation),
		loop: readonlyBox(() => loop),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
