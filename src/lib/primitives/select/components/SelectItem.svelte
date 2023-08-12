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
	const {
		elements: { option }
	} = ctx.setItem(value);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if asChild}
	<slot item={$option} />
{:else}
	<div
		use:melt={$option({ value, disabled, label })}
		{...$$restProps}
		on:m-click
		on:m-focusin
		on:m-focusout
		on:m-keydown
		on:m-pointerleave
		on:m-pointermove
		on:click
		on:keydown
	>
		<slot item={$option}>
			{label ? label : value}
		</slot>
	</div>
{/if}
