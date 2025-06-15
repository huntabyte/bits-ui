<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContextMenuRootProps } from "../types.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { noop } from "$lib/internal/noop.js";
	import { MenuMenuState, MenuRootState } from "$lib/bits/menu/menu.svelte.js";

	let {
		open = $bindable(false),
		dir = "ltr",
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		children,
	}: ContextMenuRootProps = $props();

	const root = MenuRootState.create({
		variant: box.with(() => "context-menu"),
		dir: box.with(() => dir),
		onClose: () => {
			open = false;
			onOpenChange?.(false);
		},
	});

	MenuMenuState.create(
		{
			open: box.with(
				() => open,
				(v) => {
					open = v;
					onOpenChange(v);
				}
			),
			onOpenChangeComplete: box.with(() => onOpenChangeComplete),
		},
		root
	);
</script>

<FloatingLayer>
	{@render children?.()}
</FloatingLayer>
