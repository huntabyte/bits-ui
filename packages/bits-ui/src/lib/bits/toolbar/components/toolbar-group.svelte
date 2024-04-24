<script lang="ts">
	import type { GroupProps } from "../index.js";
	import { setToolbarGroupState } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { Box, box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
		id = useId(),
		value = $bindable(),
		onValueChange,
		type,
		disabled = false,
		...restProps
	}: GroupProps = $props();

	value === undefined && (value = type === "single" ? "" : []);

	const state = setToolbarGroupState({
		id: readonlyBox(() => id),
		disabled: readonlyBox(() => disabled),
		type,
		value: box(
			() => value!,
			(v) => {
				value = v;
				onValueChange?.(v as any);
			}
		) as Box<string> | Box<string[]>,
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
