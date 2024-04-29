<script lang="ts">
	import { box } from "runed";
	import type { RootProps } from "../index.js";
	import { useMenuRoot } from "../menu.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let { open = $bindable(false), onOpenChange, children }: RootProps = $props();

	useMenuRoot({
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
