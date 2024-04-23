<script lang="ts">
	import { setAccordionRootState } from "../accordion.svelte.js";
	import type { RootProps } from "../index.js";
	import { type Box, box, mergeProps, readonlyBox, useId } from "$lib/internal/index.js";

	let {
		disabled = false,
		asChild,
		children,
		child,
		type,
		value = $bindable(),
		el = $bindable(),
		id = useId(),
		onValueChange,
		loop = true,
		orientation = "vertical",
		...restProps
	}: RootProps = $props();

	value === undefined && (value = type === "single" ? "" : []);

	const rootState = setAccordionRootState({
		type,
		value: box(
			() => value!,
			(v) => {
				value = v;
				onValueChange?.(v as any);
			}
		) as Box<string> | Box<string[]>,
		id: readonlyBox(() => id),
		disabled: readonlyBox(() => disabled),
		loop: readonlyBox(() => loop),
		orientation: readonlyBox(() => orientation),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
