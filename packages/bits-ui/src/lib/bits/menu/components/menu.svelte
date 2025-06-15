<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { MenuRootProps } from "../types.js";
	import { MenuMenuState, MenuRootState } from "../menu.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";

	let {
		open = $bindable(false),
		dir = "ltr",
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		_internal_variant: variant = "dropdown-menu",
		children,
	}: MenuRootProps & {
		_internal_variant?: "context-menu" | "dropdown-menu" | "menubar";
	} = $props();

	const root = MenuRootState.create({
		variant: box.with(() => variant),
		dir: box.with(() => dir),
		onClose: () => {
			open = false;
			onOpenChange(false);
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
