<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { RadioItemEvents, RadioItemProps } from "../types.js";

	type $$Props = RadioItemProps;
	type $$Events = RadioItemEvents;
	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;
	const {
		elements: { radioItem }
	} = ctx.setRadioItem(value);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->

{#if asChild}
	<slot radioItem={$radioItem} />
{:else}
	<div
		use:melt={$radioItem({ value, disabled })}
		{...$$restProps}
		on:m-click
		on:m-focusin
		on:m-focusout
		on:m-keydown
		on:m-pointerdown
		on:m-pointerleave
		on:m-pointermove
		on:click
		on:keydown
	>
		<slot radioItem={$radioItem} />
	</div>
{/if}
