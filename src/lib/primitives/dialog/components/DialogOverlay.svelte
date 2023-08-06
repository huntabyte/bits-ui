<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { AlertDialogOverlayProps } from "../types.js";

	type $$Props = AlertDialogOverlayProps;
	const overlay = ctx.getOverlay();
</script>

<div use:melt={$overlay} {...$$restProps} />
