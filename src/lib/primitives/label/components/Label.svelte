<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	const label = ctx.getLabel();
</script>

<label use:melt={$label} {...$$restProps}>
	<slot />
</label>
