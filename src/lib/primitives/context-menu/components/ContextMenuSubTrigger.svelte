<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { SubTriggerProps } from "../types.js";

	type $$Props = SubTriggerProps;
	const subTrigger = ctx.getSubTrigger();
</script>

<div use:melt={$subTrigger} {...$$restProps} on:m-click>
	<slot />
</div>
