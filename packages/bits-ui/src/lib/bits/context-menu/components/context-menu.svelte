<script lang="ts">
	import { boxWith } from "svelte-toolbelt";
	import type { ContextMenuRootProps } from "../types.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { noop } from "$lib/internal/noop.js";
	import { MenuMenuState, MenuRootState } from "$lib/bits/menu/menu.svelte.js";

	let {
		open = $bindable(false),
		dir = "ltr",
		// debugMode = false,
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		children,
	}: ContextMenuRootProps = $props();

	const root = MenuRootState.create({
		variant: boxWith(() => "context-menu" as const),
		dir: boxWith(() => dir),
		// debugMode: boxWith(() => debugMode),
		onClose: () => {
			open = false;
			onOpenChange?.(false);
		},
	});

	MenuMenuState.create(
		{
			open: boxWith(
				() => open,
				(v) => {
					open = v;
					onOpenChange(v);
				}
			),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
		},
		root
	);
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
