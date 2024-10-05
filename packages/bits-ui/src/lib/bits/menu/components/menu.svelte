<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { MenuRootProps } from "../types.js";
	import { useMenuMenu, useMenuRoot } from "../menu.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";

	let {
		open = $bindable(false),
		dir = "ltr",
		onOpenChange = noop,
		controlledOpen = false,
		_internal_variant: variant = "dropdown-menu",
		children,
	}: MenuRootProps & {
		_internal_variant?: "context-menu" | "dropdown-menu" | "menubar";
	} = $props();

	const root = useMenuRoot({
		variant: box.with(() => variant),
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

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
