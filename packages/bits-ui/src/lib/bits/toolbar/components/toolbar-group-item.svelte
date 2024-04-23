<script lang="ts">
	import type { GroupItemProps } from "../index.js";
	import { setToolbarGroupItemState } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/use-id.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";

	let {
		asChild,
		child,
		children,
		value,
		disabled = false,
		type = "button",
		id = useId(),
		el = $bindable(),
		...restProps
	}: GroupItemProps = $props();

	const state = setToolbarGroupItemState({
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
