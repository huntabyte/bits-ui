<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ContentProps } from "../types.js";

	type $$Props = ContentProps;
	export let sideOffset: $$Props["sideOffset"] = 4;
	const { content, open } = ctx.getContent(sideOffset);
</script>

<div use:melt={$content} {...$$restProps}>
	<slot />
</div>
