<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { RadioItemProps } from "../types.js";

	type $$Props = RadioItemProps;
	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;
	const radioItem = ctx.setRadioItem(value);
</script>

{#if asChild}
	<slot radioItem={$radioItem} />
{:else}
	<div use:melt={$radioItem({ value, disabled })} {...$$restProps}>
		<slot radioItem={$radioItem} />
	</div>
{/if}
