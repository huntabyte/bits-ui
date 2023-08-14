<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";
	type $$Props = Props;

	export let positioning: $$Props["positioning"] = undefined;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;
	export let openDelay: $$Props["openDelay"] = 700;
	export let closeDelay: $$Props["closeDelay"] = 300;
	export let closeOnOutsideClick: $$Props["closeOnOutsideClick"] = undefined;
	export let closeOnEscape: $$Props["closeOnEscape"] = undefined;
	export let arrowSize: $$Props["arrowSize"] = undefined;
	export let portal: $$Props["portal"] = undefined;

	const {
		states: { open: localOpen },
		updateOption
	} = ctx.set({
		defaultOpen: open,
		positioning,
		openDelay,
		closeDelay,
		closeOnOutsideClick,
		closeOnEscape,
		arrowSize,
		portal,
		onOpenChange: ({ next }) => {
			onOpenChange?.(next);
			open = next;
			return next;
		}
	});

	$: open !== undefined && localOpen.set(open);
	$: updateOption("positioning", positioning);
	$: updateOption("openDelay", openDelay);
	$: updateOption("closeDelay", closeDelay);
	$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: updateOption("arrowSize", arrowSize);
	$: updateOption("portal", portal);
</script>

<slot />
