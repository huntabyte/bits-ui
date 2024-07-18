<script lang="ts">
	import type { ArrowProps } from "../index.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let { ref = $bindable(null), ...restProps }: ArrowProps = $props();
</script>

<FloatingLayer.Arrow bind:ref {...restProps} />
