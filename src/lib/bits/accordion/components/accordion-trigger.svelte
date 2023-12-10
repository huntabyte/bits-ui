<script lang="ts">
	import type { AccordionTriggerProps } from "./types.js";
	import { getAccordionItemContext } from "./state.svelte.js";

	let {
		disabled = false,
		asChild = false,
		el = null,
		onkeydown = undefined,
		onclick = undefined,
		...props
	} = $props<AccordionTriggerProps>();

	const itemState = getAccordionItemContext();
	const triggerState = itemState.createTrigger({
		el,
		disabled,
		onkeydown,
		onclick
	});

	$effect(() => {
		triggerState.disabled = disabled;
		triggerState.el = el;
		triggerState.handlers.click = onclick;
		triggerState.handlers.keydown = onkeydown;
	});
</script>

{#if asChild}
	<slot />
{:else}
	<button
		bind:this={el}
		type="button"
		{...triggerState.attrs}
		{...props}
		onclick={triggerState.onclick}
		onkeydown={triggerState.onkeydown}
	>
		<slot />
	</button>
{/if}
