<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	const isChecked = ctx.get().helpers.isChecked;
</script>

<input {...$$restProps} hidden value={$isChecked ? true : false} />
