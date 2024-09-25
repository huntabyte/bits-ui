<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SubProps } from "../index.js";
	import { useMenuSubmenu } from "../menu.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		controlledOpen = false,
		children,
	}: SubProps = $props();

	useMenuSubmenu({
		open: box.with(
			() => open,
			(v) => {
				if (controlledOpen) {
					onOpenChange(v);
				} else {
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
