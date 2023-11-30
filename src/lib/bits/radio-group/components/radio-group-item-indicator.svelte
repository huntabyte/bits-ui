<script lang="ts">
	import { getRadioIndicator, getAttrs } from "../ctx.js";
	const { isChecked, value } = getRadioIndicator();

	export let asChild = false;

	const attrs = getAttrs("item-indicator");

	$: slotProps = {
		checked: $isChecked(value),
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div {...attrs}>
		{#if $isChecked(value)}
			<slot {...slotProps} />
		{/if}
	</div>
{/if}
