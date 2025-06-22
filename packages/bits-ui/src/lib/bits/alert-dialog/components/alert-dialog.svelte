<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { AlertDialogRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { DialogRootState } from "$lib/bits/dialog/dialog.svelte.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		children,
	}: AlertDialogRootProps = $props();

	DialogRootState.create({
		variant: box.with(() => "alert-dialog"),
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		onOpenChangeComplete: box.with(() => onOpenChangeComplete),
	});
</script>

{@render children?.()}
