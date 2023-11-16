<script lang="ts">
	import type { Props } from "../types.js";
	import { setCtx } from "../ctx.js";
	type $$Props = Props;

	export let closeOnOutsideClick: $$Props["closeOnOutsideClick"] = undefined;
	export let closeOnEscape: $$Props["closeOnEscape"] = undefined;
	export let portal: $$Props["portal"] = undefined;
	export let forceVisible: $$Props["forceVisible"] = true;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;
	export let preventScroll: $$Props["preventScroll"] = undefined;
	export let positioning: $$Props["positioning"] = undefined;
	export let loop: $$Props["loop"] = undefined;
	export let dir: $$Props["dir"] = undefined;
	export let typeahead: $$Props["typeahead"] = undefined;
	export let closeFocus: $$Props["closeFocus"] = undefined;
	export let disableFocusFirstItem: $$Props["disableFocusFirstItem"] = undefined;

	const {
		states: { open: localOpen },
		updateOption,
		ids
	} = setCtx({
		closeOnOutsideClick,
		closeOnEscape,
		portal,
		forceVisible,
		defaultOpen: open,
		preventScroll,
		positioning,
		loop,
		dir,
		typeahead,
		disableFocusFirstItem,
		closeFocus,
		onOpenChange: ({ next }) => {
			if (open !== next) {
				onOpenChange?.(next);
				open = next;
			}
			return next;
		}
	});

	$: open !== undefined && localOpen.set(open);

	$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: updateOption("portal", portal);
	$: updateOption("forceVisible", forceVisible);
	$: updateOption("preventScroll", preventScroll);
	$: updateOption("positioning", positioning);
	$: updateOption("loop", loop);
	$: updateOption("dir", dir);
	$: updateOption("closeFocus", closeFocus);
	$: updateOption("disableFocusFirstItem", disableFocusFirstItem);
	$: updateOption("typeahead", typeahead);
</script>

<slot {ids} />
