<script lang="ts">
	import { box } from "runed";
	import type { RootProps } from "../index.js";
	import { usePopoverRoot } from "../popover.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let { open = $bindable(false), children, onOpenChange }: RootProps = $props();

	usePopoverRoot({
		open: box.with(
			() => open,
			(v) => {
				if (open !== v) {
					open = v;
					onOpenChange?.(v);
				}
			}
		),
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
