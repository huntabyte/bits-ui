<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setCollapsibleRootState } from "../collapsible.svelte.js";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		open = $bindable(false),
		disabled = false,
		onOpenChange,
		...restProps
	}: RootProps = $props();

	const rootState = setCollapsibleRootState({
		open: box(
			() => open,
			(v) => {
				open = v;
				onOpenChange?.(v);
			}
		),
		disabled: readonlyBox(() => disabled),
	});

	const mergedProps = $derived({
		...rootState.props,
		...restProps,
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
