<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let label: $$Props["label"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	const option = ctx.setItem(value).elements.option;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if asChild}
	<slot builder={$option({ value, disabled, label })} />
{:else}
	{@const builder = $option({ value, disabled, label })}
	<div
		use:melt={builder}
		{...$$restProps}
		on:m-click
		on:m-focusin
		on:m-focusout
		on:m-keydown
		on:m-pointerleave
		on:m-pointermove
	>
		<slot {builder}>
			{label ? label : value}
		</slot>
	</div>
{/if}
