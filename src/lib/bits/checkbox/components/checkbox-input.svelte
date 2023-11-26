<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";

	const {
		elements: { input },
		options: { value }
	} = getCtx();
</script>

<input use:melt={$input} value={$value ?? "on"} {...$$restProps} />
