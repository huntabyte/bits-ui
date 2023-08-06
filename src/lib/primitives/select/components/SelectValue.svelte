<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { ValueProps } from "../types.js";

	type $$Props = ValueProps;
	export let placeholder: $$Props["placeholder"] = "";
	const valueLabel = ctx.getValue();
</script>

<span {...$$restProps}>
	{$valueLabel ? $valueLabel : placeholder}
</span>
