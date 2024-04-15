<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setCollapsibleRootState } from "../collapsible.svelte.js";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		open: openProp = $bindable(false),
		disabled: disabledProp = false,
		onOpenChange,
		...restProps
	}: RootProps = $props();

	const open = box(
		() => openProp,
		(v) => {
			openProp = v;
			onOpenChange?.(v);
		}
	);

	const disabled = readonlyBox(() => disabledProp);

	const rootState = setCollapsibleRootState({
		open,
		disabled,
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
