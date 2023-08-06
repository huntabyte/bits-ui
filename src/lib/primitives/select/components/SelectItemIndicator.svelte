<script lang="ts">
	import { ctx } from "../ctx.js";
	const { isSelected, value } = ctx.getItemIndicator();
</script>

{#if $isSelected(value)}
	<slot />
{/if}
