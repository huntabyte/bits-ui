<script lang="ts">
	import { box } from "runed";
	import type { SubProps } from "../index.js";
	import { useMenuSubmenu } from "../menu.svelte.js";

	let { open = $bindable(false), onOpenChange, children }: SubProps = $props();

	useMenuSubmenu({
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

{@render children?.()}
