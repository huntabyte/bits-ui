<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { RadioItemEvents, RadioItemProps } from "../types.js";

	type $$Props = RadioItemProps;
	type $$Events = RadioItemEvents;
	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;
	const radioItem = ctx.setRadioItem(value).elements.radioItem;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if asChild}
	<slot builder={$radioItem} />
{:else}
	{@const builder = $radioItem({ value, disabled })}
	<div
		use:melt={builder}
		{...$$restProps}
		on:m-click
		on:m-focusin
		on:m-focusout
		on:m-keydown
		on:m-pointerdown
		on:m-pointerleave
		on:m-pointermove
	>
		<slot {builder} />
	</div>
{/if}
