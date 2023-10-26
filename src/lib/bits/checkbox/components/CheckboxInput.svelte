<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	const {
		helpers: { isChecked },
		options: { disabled }
	} = getCtx();
	const attrs = getAttrs("input");
</script>

<input hidden value={$isChecked ? true : false} disabled={$disabled} {...$$restProps} {...attrs} />
