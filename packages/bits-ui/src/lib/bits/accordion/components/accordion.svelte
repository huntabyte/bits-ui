<script lang="ts">
	import { setAccordionRootState } from "../state.svelte.js";
	import type { AccordionRootProps } from "../types.js";

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

	const rootState = setAccordionRootState({ type, value, id, onValueChange });

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
