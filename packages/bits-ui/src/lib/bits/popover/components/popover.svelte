<script lang="ts">
	import { boxWith } from "svelte-toolbelt";
	import type { PopoverRootProps } from "../types.js";
	import { PopoverRootState } from "../popover.svelte.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { noop } from "$lib/internal/noop.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		children,
	}: PopoverRootProps = $props();

	PopoverRootState.create({
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
