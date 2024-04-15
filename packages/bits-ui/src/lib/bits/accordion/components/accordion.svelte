<script lang="ts">
	import { setAccordionRootState } from "../accordion.svelte.js";
	import type { AccordionRootProps } from "../types.js";
	import { Box, box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { generateId } from "$lib/internal/id.js";

	let {
		disabled: disabledProp = false,
		asChild,
		children,
		child,
		type,
		value: valueProp = $bindable(),
		el = $bindable(),
		id: idProp = generateId(),
		onValueChange,
		...restProps
	}: AccordionRootProps = $props();

	valueProp === undefined && (valueProp = type === "single" ? "" : []);

	const value = box(
		() => valueProp!,
		(v) => {
			valueProp = v;
			onValueChange?.(v as any);
		}
	) as Box<string> | Box<string[]>;

	const id = readonlyBox(() => idProp);
	const disabled = readonlyBox(() => disabledProp);

	const rootState = setAccordionRootState({ type, value, id, disabled });

	const mergedProps = {
		...rootState.props,
		...restProps,
	};
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
