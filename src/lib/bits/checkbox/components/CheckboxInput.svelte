<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	const {
		helpers: { isChecked },
		options: { disabled }
	} = ctx.get();
	const attrs = ctx.getAttrs("input");
</script>

<input hidden value={$isChecked ? true : false} disabled={$disabled} {...$$restProps} {...attrs} />
