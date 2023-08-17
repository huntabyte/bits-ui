<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	const {
		elements: { arrow }
	} = ctx.get();
</script>

<div use:melt={$arrow} />
