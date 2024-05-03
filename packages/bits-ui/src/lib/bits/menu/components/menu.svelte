<script lang="ts">
	import { box } from "runed";
	import type { RootProps } from "../index.js";
	import { useMenuMenu, useMenuRoot } from "../menu.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let { open = $bindable(false), dir = "ltr", onOpenChange, children }: RootProps = $props();

	const root = useMenuRoot({
		dir: box.with(() => dir),
		onClose: () => {
			open = false;
			onOpenChange?.(false);
		},
	});

	useMenuMenu(root, {
		open: box.with(
			() => open,
			(v) => {
				if (v !== open) {
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
