<script lang="ts">
	import type { AspectRatioProps } from "./types.js";

	let { ratio = 1 / 1, ...props } = $props<AspectRatioProps>();

	const attrs = {
		"data-aspect-ratio-root": ""
	};
</script>

<div
	style:position="relative"
	style:width="100%"
	style:padding-bottom="{100 / ratio}%"
>
	<div
		style:position="absolute"
		style:top="0"
		style:right="0"
		style:bottom="0"
		style:left="0"
		{...attrs}
		{...props}
	>
		<slot />
	</div>
</div>
