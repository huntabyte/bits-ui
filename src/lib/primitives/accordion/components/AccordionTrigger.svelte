<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;

	const { trigger, props } = ctx.getTrigger();
</script>

<button use:melt={$trigger(props)} {...$$restProps} on:click on:keydown on:m-keydown on:m-click>
	<slot />
</button>
