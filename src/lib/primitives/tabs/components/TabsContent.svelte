<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ContentProps } from "../types.js";

	type $$Props = ContentProps;
	export let value: $$Props["value"];

	const {
		elements: { content }
	} = ctx.get();
</script>

<div use:melt={$content(value)} {...$$restProps}>
	<slot />
</div>
