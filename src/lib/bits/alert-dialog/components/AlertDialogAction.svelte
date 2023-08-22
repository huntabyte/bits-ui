<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ActionEvents, ActionProps } from "../types.js";

	type $$Props = ActionProps;
	type $$Events = ActionEvents;
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
