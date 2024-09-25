<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useTooltipRoot } from "../tooltip.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		disabled = false,
		delayDuration,
		disableCloseOnTriggerClick = false,
		disableHoverableContent,
		ignoreNonKeyboardFocus = false,
		controlledOpen = false,
		children,
	}: RootProps = $props();

	useTooltipRoot({
		open: box.with(
			() => open,
			(v) => {
				if (controlledOpen) {
					onOpenChange(v);
				} else {
					open = v;
					onOpenChange(v);
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
