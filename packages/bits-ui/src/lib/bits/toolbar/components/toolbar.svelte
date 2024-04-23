<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setToolbarRootState } from "../toolbar.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { useId } from "$lib/internal/use-id.svelte.js";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
		id = useId(),
		orientation = "horizontal",
		loop = true,
		...restProps
	}: RootProps = $props()

	const state = setToolbarRootState({
		id: readonlyBox(() => id),
		orientation: readonlyBox(() => orientation),
		loop: readonlyBox(() => loop),
	})

	const mergedProps = $derived(mergeProps(restProps, state.props))

</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}