<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { LinkPreviewRootProps } from "../types.js";
	import { LinkPreviewRootState } from "../link-preview.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		openDelay = 700,
		closeDelay = 300,
		children,
	}: LinkPreviewRootProps = $props();

	LinkPreviewRootState.create({
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		openDelay: box.with(() => openDelay),
		closeDelay: box.with(() => closeDelay),
		onOpenChangeComplete: box.with(() => onOpenChangeComplete),
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
