<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { PortalProps } from "../types.js";

	type $$Props = PortalProps;
	const {
		elements: { portalled }
	} = ctx.get();
</script>

<div use:melt={$portalled} {...$$restProps}>
	<slot />
</div>
