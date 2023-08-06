<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { ThumbProps } from "../types.js";

	type $$Props = ThumbProps;
	const {
		states: { checked }
	} = ctx.get();
</script>

<span data-state={$checked ? "checked" : "unchecked"} {...$$restProps} />
