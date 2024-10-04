<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { MenuSubProps } from "../types.js";
	import { useMenuSubmenu } from "../menu.svelte.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		controlledOpen = false,
		children,
	}: MenuSubProps = $props();

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

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
