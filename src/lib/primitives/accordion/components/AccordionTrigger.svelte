<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerProps } from "../types.js";
	type $$Props = TriggerProps;

	const { trigger, props } = ctx.getTrigger();
</script>

<button use:melt={$trigger(props)} {...$$restProps} on:click on:keydown>
	<slot />
</button>
