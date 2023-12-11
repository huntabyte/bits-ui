<script lang="ts">
	import type { CollapsibleProps } from "./types.js";
	import { initCollapsibleState } from "./state.svelte.js";

	let {
		open = false,
		defaultOpen = false,
		disabled = false,
		onOpenChange = undefined,
		children,
		child,
		...props
	} = $props<CollapsibleProps>();

	const rootState = initCollapsibleState({
		open,
		disabled,
		onOpenChange,
		defaultOpen
	});

	$effect(() => {
		rootState.open = open;
		rootState.disabled = disabled;
		rootState.onOpenChange = onOpenChange;
		rootState.defaultOpen = defaultOpen;
	});
</script>

{#if props.asChild && child}
	{@render child({ ...props })}
{:else if children}
	<div {...props} {...rootState.rootAttrs}>
		{@render children()}
	</div>
{/if}
