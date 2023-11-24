<script lang="ts">
	import { getAttrs } from "../ctx.js";
	import type { GridRowProps } from "../types.js";

	type $$Props = GridRowProps;

	export let asChild: $$Props["asChild"] = false;

	const attrs = getAttrs("grid-row");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<tr {...$$restProps} {...attrs}>
		<slot {attrs} />
	</tr>
{/if}
