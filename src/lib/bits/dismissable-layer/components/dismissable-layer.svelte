<script lang="ts">
	import { onKeyStroke } from "$lib/internal/utils/on.svelte";
	import { DismissibleLayerProps } from "../types";
	import { useFocusOutside, usePointerDownOutside } from "../utils.svelte";

	let { disableOutsidePointerEvents = false, ...props } = $props<DismissibleLayerProps>();
</script>
