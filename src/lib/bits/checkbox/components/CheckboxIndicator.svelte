<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { IndicatorProps } from "../types.js";

	type $$Props = IndicatorProps;
	const {
		helpers: { isChecked, isIndeterminate }
	} = ctx.get();
	const attrs = ctx.getAttrs("indicator");
</script>

<div {...$$restProps} {...attrs}>
	<slot isChecked={$isChecked} isIndeterminate={$isIndeterminate} />
</div>
