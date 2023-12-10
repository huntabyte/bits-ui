<script lang="ts">
	import type { Snippet } from "svelte";
	import { getCheckboxState } from "./state.svelte";
	import type { CheckboxIndicatorProps } from "./types";

	type Props = Omit<CheckboxIndicatorProps, "children"> & {
		children: Snippet<
			CheckboxIndicatorProps & { checked: boolean | "indeterminate" }
		>;
	};

	let { asChild = false, children, ...props } = $props<Props>();

	const rootState = getCheckboxState();
</script>

{#if asChild}
	{@render children({
		...props,
		...rootState.indicatorAttrs,
		checked: rootState.checked
	})}
{:else}
	<div {...props} {...rootState.indicatorAttrs}>
		{@render children({
			...props,
			...rootState.indicatorAttrs,
			checked: rootState.checked
		})}
	</div>
{/if}
