<script lang="ts">
	import { getRadioIndicator } from "../ctx.js";
	const { isChecked, value } = getRadioIndicator();
</script>

{#if $isChecked(value)}
	<slot />
{/if}
