<script lang="ts">
,

	import { CONTENT_MARGIN } from "../select.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		align = "start",
		collisionPadding = CONTENT_MARGIN,
		style = {},
		content,
		...restProps
	}: FloatingLayer.ContentImplProps = $props();

</script>

<FloatingLayer.Content
	{align}
	{collisionPadding}
	{...restProps}
	style={{
		...style,
		boxSizing: "border-box",
		"--bits-select-content-transform-origin": "var(--bits-floating-transform-origin)",
		"--bits-select-content-available-width": "var(--bits-floating-available-width)",
		"--bits-select-content-available-height": "var(--bits-floating-available-height)",
		"--bits-select-trigger-width": "var(--bits-floating-trigger-width)",
		"--bits-select-trigger-height": "var(--bits-floating-trigger-height)",
	}}
></FloatingLayer.Content>
