<script lang="ts">
	import type { Props } from "../types.js";
	import { setCtx } from "../ctx.js";
	import { isBrowser } from "$lib/internal/is.js";
	import { tick } from "svelte";

	type $$Props = Props;
	export let positioning: $$Props["positioning"] = undefined;
	export let arrowSize: $$Props["arrowSize"] = undefined;
	export let disableFocusTrap: $$Props["disableFocusTrap"] = undefined;
	export let closeOnEscape: $$Props["closeOnEscape"] = undefined;
	export let closeOnOutsideClick: $$Props["closeOnOutsideClick"] = undefined;
	export let preventScroll: $$Props["preventScroll"] = undefined;
	export let portal: $$Props["portal"] = undefined;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;
	export let focusTriggerOnClose: $$Props["focusTriggerOnClose"] = false;
	export let openFocus: $$Props["openFocus"] = undefined;
	export let closeFocus: $$Props["closeFocus"] = undefined;

	const {
		updateOption,
		states: { open: localOpen },
		ids: { trigger }
	} = setCtx({
		positioning,
		arrowSize,
		disableFocusTrap,
		closeOnEscape,
		closeOnOutsideClick,
		preventScroll,
		portal,
		defaultOpen: open,
		openFocus,
		closeFocus,
		onOpenChange: ({ next, curr }) => {
			return customOnOpenChange({ next, curr });
		}
	});

	type ChangeFn = ({ curr, next }: { curr: boolean; next: boolean }) => boolean;

	const customOnOpenChange: ChangeFn = ({ next }) => {
		if (open === next) return next;

		if (next === false && focusTriggerOnClose && isBrowser) {
			tick().then(() => {
				const triggerEl = document.getElementById(trigger);
				if (triggerEl) {
					triggerEl.focus();
				}
			});
		}
		onOpenChange?.(next);
		open = next;
		return next;
	};

	$: open !== undefined && localOpen.set(open);

	$: updateOption("positioning", positioning);
	$: updateOption("arrowSize", arrowSize);
	$: updateOption("disableFocusTrap", disableFocusTrap);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
	$: updateOption("preventScroll", preventScroll);
	$: updateOption("portal", portal);
	$: updateOption("openFocus", openFocus);
	$: updateOption("closeFocus", closeFocus);
</script>

<slot />
