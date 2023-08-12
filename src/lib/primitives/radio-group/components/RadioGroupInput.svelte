<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { HTMLInputAttributes } from "svelte/elements";
	import { ctx } from "../ctx.js";

	const {
		elements: { itemInput }
	} = ctx.get();

	type $$Props = HTMLInputAttributes;
</script>

<input use:melt={$itemInput} hidden {...$$restProps} />
