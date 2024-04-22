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
		value: valueProp = $bindable(),
		el = $bindable(),
		id = useId(),
		onValueChange,
		...restProps
	}: RootProps = $props();

	valueProp === undefined && (valueProp = type === "single" ? "" : []);

	const rootState = setAccordionRootState({
		type,
		value: box(
			() => valueProp!,
			(v) => {
				valueProp = v;
				onValueChange?.(v as any);
			}
		) as Box<string> | Box<string[]>,
		id: readonlyBox(() => id),
		disabled: readonlyBox(() => disabled),
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
