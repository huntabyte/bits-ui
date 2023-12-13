<script lang="ts">
	import type { Snippet } from "svelte";
	import { getCheckboxState } from "./state.svelte";
	import type { CheckboxIndicatorProps } from "./types";

	let { child, children, ...props } = $props<CheckboxIndicatorProps>();

	const root = getCheckboxState();
</script>

{#if props.asChild && child}
	{@render child({
		...props,
		...root.indicatorAttrs,
		checked: root.checked
	})}
{:else if children}
	<div {...props} {...root.indicatorAttrs}>
		{@render children({
			...props,
			...root.indicatorAttrs,
			checked: root.checked
		})}
	</div>
{/if}
