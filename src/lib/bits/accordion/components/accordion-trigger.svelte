<script lang="ts">
	import type { AccordionTriggerProps } from "./types.js";
	import { getAccordionTriggerState } from "./state.svelte.js";

	let {
		disabled = false,
		asChild = false,
		el = null,
		onkeydown = undefined,
		onclick = undefined,
		...props
	} = $props<AccordionTriggerProps>();

	const trigger = getAccordionTriggerState({
		el,
		disabled,
		onkeydown,
		onclick
	});

	$effect(() => {
		trigger.disabled = disabled;
		trigger.el = el;
		trigger.handlers.click = onclick;
		trigger.handlers.keydown = onkeydown;
	});
</script>

{#if asChild}
	<slot />
{:else}
	<button
		bind:this={el}
		type="button"
		{...trigger.attrs}
		{...props}
		onclick={trigger.onclick}
		onkeydown={trigger.onkeydown}
	>
		<slot />
	</button>
{/if}
