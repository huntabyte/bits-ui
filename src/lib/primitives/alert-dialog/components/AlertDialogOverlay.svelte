<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { OverlayProps } from "../types.js";

	type $$Props = OverlayProps;
	const overlay = ctx.getOverlay();
</script>

<div use:melt={$overlay} {...$$restProps} />
