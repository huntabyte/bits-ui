<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ThumbProps } from "../types.js";

	type $$Props = ThumbProps;
	const {
		elements: { thumb }
	} = ctx.get();
</script>

<span use:melt={$thumb()} {...$$restProps} />
