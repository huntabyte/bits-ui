<script lang="ts">
	import { boxWith } from "svelte-toolbelt";
	import { DialogRootState } from "../dialog.svelte.js";
	import type { DialogRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		children,
	}: DialogRootProps = $props();

	DialogRootState.create({
		variant: boxWith(() => "dialog"),
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});
</script>

{@render children?.()}
