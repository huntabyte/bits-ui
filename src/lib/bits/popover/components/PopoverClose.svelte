<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const close = ctx.get().elements.close;
</script>

{#if asChild}
	<slot builder={$close} />
{:else}
	{@const builder = $close}
	<button use:melt={builder} {...$$restProps} on:m-click on:m-keydown>
		<slot {builder} />
	</button>
{/if}
