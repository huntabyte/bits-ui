<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { HTMLInputAttributes } from "svelte/elements";
	import { ctx } from "../ctx.js";

	const input = ctx.getInput();

	type $$Props = HTMLInputAttributes;
</script>

<input use:melt={$input} hidden {...$$restProps} />
