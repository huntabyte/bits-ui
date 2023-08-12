<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ContentProps } from "../types.js";

	type $$Props = ContentProps;
	const {
		elements: { content }
	} = ctx.get();
</script>

<div use:melt={$content} {...$$restProps}>
	<slot />
</div>
