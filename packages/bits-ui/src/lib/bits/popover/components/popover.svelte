<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setPopoverRootState } from "../popover.svelte.js";
	import { box } from "$lib/internal/box.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/index.js";

	let { open = $bindable(false), children, onOpenChange }: RootProps = $props();

	setPopoverRootState({
		open: box(
			() => open,
			(v) => {
				open = v;
				onOpenChange?.(v);
			}
		),
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
