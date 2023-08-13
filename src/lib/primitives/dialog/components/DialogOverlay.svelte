<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { OverlayProps } from "../types.js";

	type $$Props = OverlayProps;
	export let asChild = false;
	const overlay = ctx.get().elements.overlay;
</script>

{#if asChild}
	<slot builder={$overlay} />
{:else}
	<div use:melt={$overlay} {...$$restProps} />
{/if}
