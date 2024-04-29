<script lang="ts">
	import { box } from "runed";
	import type { RootProps } from "../index.js";
	import { useMenuRoot } from "../menu.svelte.js";

	let { open = $bindable(false), onOpenChange }: RootProps = $props();

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
