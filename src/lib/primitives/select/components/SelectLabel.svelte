<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { LabelEvents, LabelProps } from "../types.js";

	type $$Props = LabelProps;
	type $$Events = LabelEvents;
	const { groupLabel, id } = ctx.getGroupLabel();
</script>

<div use:melt={$groupLabel(id)} {...$$restProps}>
	<slot />
</div>
