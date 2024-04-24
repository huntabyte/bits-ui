<script lang="ts">
	import type { ItemProps } from "../index.js";
	import { setToggleGroupItemState } from "../toggle-group.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		value,
		disabled = false,
		id = useId(),
		type = "button",
		...restProps
	}: ItemProps = $props();

	const state = setToggleGroupItemState({
		id: readonlyBox(() => id),
		value: readonlyBox(() => value),
		disabled: readonlyBox(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
