<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useLinkPreviewRoot } from "../link-preview.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		openDelay = 700,
		closeDelay = 300,
		children,
	}: RootProps = $props();

	useLinkPreviewRoot({
		open: box.with(
			() => open,
			(v) => {
				if (open !== v) {
					open = v;
					onOpenChange(v);
				}
			}
		),
		openDelay: box.with(() => openDelay),
		closeDelay: box.with(() => closeDelay),
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
