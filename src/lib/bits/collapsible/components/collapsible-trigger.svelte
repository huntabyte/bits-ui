<script lang="ts">
	import { getCollapsibleState } from "./state.svelte";
	import type { CollapsibleTriggerProps } from "./types";

	let { children, child, ...props } = $props<CollapsibleTriggerProps>();

	const rootState = getCollapsibleState();
	const triggerState = rootState.createTrigger({
		onclick: props.onclick ?? undefined
	});
</script>

{#if props.asChild && child}
	{@render child({
		...props,
		...rootState.triggerAttrs,
		onclick: triggerState.onclick
	})}
{:else}
	<button
		type="button"
		{...props}
		{...rootState.triggerAttrs}
		onclick={triggerState.onclick}
	>
		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}
