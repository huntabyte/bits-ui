<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useTooltipRoot } from "../tooltip.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		open = $bindable(false),
		onOpenChange,
		disabled = false,
		delayDuration,
		disableCloseOnTriggerClick = false,
		disableHoverableContent,
		ignoreNonKeyboardFocus = false,
		children,
	}: RootProps = $props();

	useTooltipRoot({
		open: box.with(
			() => open,
			(v) => {
				if (v !== open) {
					open = v;
					onOpenChange?.(v);
				}
			}
		),
		delayDuration: box.with(() => delayDuration),
		disableCloseOnTriggerClick: box.with(() => disableCloseOnTriggerClick),
		disableHoverableContent: box.with(() => disableHoverableContent),
		ignoreNonKeyboardFocus: box.with(() => ignoreNonKeyboardFocus),
		disabled: box.with(() => disabled),
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
