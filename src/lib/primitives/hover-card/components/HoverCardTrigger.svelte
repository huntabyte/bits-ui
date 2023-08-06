<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	const trigger = ctx.getTrigger();
</script>

<svelte:element this={"a"} use:melt={$trigger} {...$$restProps}>
	<slot />
</svelte:element>
