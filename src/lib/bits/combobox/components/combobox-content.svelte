<script lang="ts">
	import { getAttrs } from "../ctx";
	import type { ContentProps } from "../types";

	type $$Props = ContentProps;

	export let asChild: $$Props["asChild"] = false;

	const attrs = getAttrs("content");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<div {...$$restProps} {...attrs}>
		<slot />
	</div>
{/if}
