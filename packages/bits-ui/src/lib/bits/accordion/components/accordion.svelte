<script lang="ts">
	import { setAccordionRootState } from "../accordion.svelte.js";
	import type { AccordionRootProps } from "../types.js";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";
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
	const id = readonlyBox(() => idProp);
	const disabled = readonlyBox(() => disabledProp);
	const forceVisible = readonlyBox(() => forceVisibleProp);

	const rootState = setAccordionRootState({ type, value, id, disabled, forceVisible });

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
