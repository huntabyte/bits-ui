<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { IndicatorProps } from "../types.js";

	type $$Props = IndicatorProps;
	const {
		helpers: { isChecked, isIndeterminate }
	} = getCtx();
	const attrs = getAttrs("indicator");
</script>

<div {...$$restProps} {...attrs}>
	<slot isChecked={$isChecked} isIndeterminate={$isIndeterminate} />
</div>
