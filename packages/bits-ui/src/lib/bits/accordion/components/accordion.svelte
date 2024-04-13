<script lang="ts">
	import { setAccordionRootState } from "../accordion.svelte.js";
	import type { AccordionRootProps } from "../types.js";
	import { box } from "$lib/internal/box.svelte.js";
	import { generateId } from "$lib/internal/id.js";

	let {
		disabled: disabledProp = false,
		forceVisible: forceVisibleProp = false,
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

	function createValueState() {
		if (type === "single") {
			valueProp === undefined && (valueProp = "");
			return box(
				() => valueProp as string,
				(v) => {
					valueProp = v;
					onValueChange?.(v as string[] & string);
				}
			);
		}
		valueProp === undefined && (valueProp = []);
		return box(
			() => valueProp as string[],
			(v) => {
				valueProp = v;
				onValueChange?.(v as string[] & string);
			}
		);
	}

	const value = createValueState();
	const id = box(() => idProp);
	const disabled = box(() => disabledProp);
	const forceVisible = box(() => forceVisibleProp);

	const rootState = setAccordionRootState({ type, value, id, disabled, forceVisible });
</script>

{#if asChild}
	{@render child?.(restProps)}
{:else}
	<div bind:this={el} {...rootState.props} {...restProps}>
		{@render children?.()}
	</div>
{/if}
