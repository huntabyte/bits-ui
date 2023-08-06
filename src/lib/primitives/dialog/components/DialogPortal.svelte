<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { PortalProps } from "../types.js";

	type $$Props = PortalProps;
	const { portal, open } = ctx.getPortal();
</script>

<div use:melt={$portal} {...$$restProps}>
	{#if $open}
		<slot />
	{/if}
</div>
