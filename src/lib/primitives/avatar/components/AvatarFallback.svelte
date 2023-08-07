<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { FallbackProps } from "../types.js";

	type $$Props = FallbackProps;

	const {
		elements: { fallback }
	} = ctx.getFallback();
</script>

<span use:melt={$fallback} {...$$restProps}>
	<slot />
</span>
