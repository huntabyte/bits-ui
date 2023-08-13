<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { ThumbProps } from "../types.js";

	type $$Props = ThumbProps;
	export let asChild = false;
	const checked = ctx.get().states.checked;
</script>

{#if asChild}
	<slot builder={$checked} />
{:else}
	<span data-state={$checked ? "checked" : "unchecked"} {...$$restProps} />
{/if}
