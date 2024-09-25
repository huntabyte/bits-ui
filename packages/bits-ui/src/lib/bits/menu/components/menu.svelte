<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useMenuMenu, useMenuRoot } from "../menu.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		open = $bindable(false),
		dir = "ltr",
		onOpenChange = noop,
		controlledOpen = false,
		children,
	}: RootProps = $props();

	const root = useMenuRoot({
		dir: box.with(() => dir),
		onClose: () => {
			if (controlledOpen) {
				onOpenChange(false);
			} else {
				open = false;
				onOpenChange?.(false);
			}
		},
	});

	useMenuMenu(root, {
		open: box.with(
			() => open,
			(v) => {
				if (controlledOpen) {
					onOpenChange(v);
				} else {
					open = v;
					onOpenChange(v);
				}
			}
		),
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
