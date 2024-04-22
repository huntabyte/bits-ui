<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setToggleGroupRootState } from "../toggle-group.svelte.js";
	import { Box, box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { useId } from "$lib/internal/use-id.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";

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
		loop = true,
		orientation = "horizontal",
		rovingFocus = true,
		...restProps
	}: RootProps = $props();

	value === undefined && (value = type === "single" ? "" : []);

	const state = setToggleGroupRootState({
		id: readonlyBox(() => id),
		value: box(
			() => value!,
			(v) => {
				value = v;
				onValueChange?.(v as any);
			}
		) as Box<string> | Box<string[]>,
		disabled: readonlyBox(() => disabled),
		loop: readonlyBox(() => loop),
		orientation: readonlyBox(() => orientation),
		rovingFocus: readonlyBox(() => rovingFocus),
		type,
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
