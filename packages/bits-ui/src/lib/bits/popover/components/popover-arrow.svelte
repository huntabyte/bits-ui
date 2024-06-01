<script lang="ts">
	import type { ArrowProps } from "../index.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let { el = $bindable(), ...restProps }: ArrowProps = $props();
</script>

<FloatingLayer.Arrow bind:el {...restProps} data-popover-arrow="" />
