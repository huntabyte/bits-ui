<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { DescriptionProps } from "../types.js";

	type $$Props = DescriptionProps;
	const {
		elements: { description }
	} = ctx.get();
</script>

<div use:melt={$description} {...$$restProps}>
	<slot />
</div>
