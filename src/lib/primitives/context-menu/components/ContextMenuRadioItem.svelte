<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { RadioItemProps } from "../types.js";

	type $$Props = RadioItemProps;
	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;
	const radioItem = ctx.getRadioItem(value);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->
{#if asChild}
	<slot radioItem={$radioItem} />
{:else}
	<div use:melt={$radioItem({ value, disabled })} {...$$restProps} on:click>
		<slot radioItem={$radioItem} />
	</div>
{/if}
