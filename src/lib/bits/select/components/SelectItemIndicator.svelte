<script lang="ts">
	import { getItemIndicator } from "../ctx.js";
	const { isSelected, value } = getItemIndicator();
</script>

{#if $isSelected(value)}
	<slot />
{/if}
