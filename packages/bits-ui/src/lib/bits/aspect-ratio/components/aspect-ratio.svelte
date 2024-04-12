<script lang="ts">
	import type { Props } from "../index.js";

	let { ratio, el, ...restProps }: Props = $props();
</script>

<div style:position="relative" style:width="100%" style:padding-bottom="{ratio ? 100 / ratio : 0}%">
	<div
		bind:this={el}
		style:position="absolute"
		style:top="0"
		style:right="0"
		style:bottom="0"
		style:left="0"
		{...restProps}
		data-aspect-ratio-root=""
	>
		<slot />
	</div>
</div>
