<script lang="ts">
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let ratio: $$Props["ratio"] = 1 / 1;

	const attrs = {
		"data-aspect-ratio-root": ""
	};
</script>

<div
	style:position="relative"
	style:width="100%"
	style:padding-bottom="{ratio ? 100 / ratio : 0}%"
>
	<div
		style:position="absolute"
		style:top="0"
		style:right="0"
		style:bottom="0"
		style:left="0"
		{...$$restProps}
		{...attrs}
	>
		<slot />
	</div>
</div>
