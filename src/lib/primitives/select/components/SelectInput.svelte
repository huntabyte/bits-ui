<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;
	const input = ctx.getInput();
</script>

<input use:melt={$input} hidden {...$$restProps} />
