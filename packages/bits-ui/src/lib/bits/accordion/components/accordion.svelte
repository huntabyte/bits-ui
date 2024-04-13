<script lang="ts">
	import { setAccordionRootState } from "../accordion.svelte.js";
	import type { AccordionRootProps } from "../types.js";
	import { box } from "$lib/internal/box.svelte.js";

	let {
		disabled = false,
		forceVisible = false,
		asChild,
		children,
		child,
		type,
		value = $bindable(),
		el = $bindable(),
		id,
		onValueChange,
		...restProps
	}: AccordionRootProps = $props();

	function createValueState() {
		if (type === "single") {
			value === undefined && (value = "");
			return box(
				() => value as string,
				(v) => {
					value = v;
					onValueChange?.(v as string[] & string);
				}
			);
		}
		value === undefined && (value = []);
		return box(
			() => value as string[],
			(v) => {
				value = v;
				onValueChange?.(v as string[] & string);
			}
		);
	}

	const valueState = createValueState();

	const rootState = setAccordionRootState({ type, value: valueState, id });

	$effect.pre(() => {
		if (value !== undefined) {
			rootState.value = value;
		}
	});

	$effect.pre(() => {
		value = rootState.value;
	});

	$effect.pre(() => {
		if (id) {
			rootState.id = id;
		}
	});

	$effect.pre(() => {
		rootState.disabled = disabled;
	});

	$effect.pre(() => {
		rootState.forceVisible = forceVisible;
	});

	
</script>

{#if asChild}
	{@render child?.(restProps)}
{:else}
	<div bind:this={el} {...rootState.props} {...restProps}>
		{@render children?.()}
	</div>
{/if}
