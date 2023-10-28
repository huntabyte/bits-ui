<script lang="ts">
	import type { MenuProps } from "../types.js";
	import { setMenuCtx } from "../ctx.js";
	type $$Props = MenuProps;

	export let closeOnOutsideClick: $$Props["closeOnOutsideClick"] = undefined;
	export let closeOnEscape: $$Props["closeOnEscape"] = undefined;
	export let portal: $$Props["portal"] = undefined;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;
	export let preventScroll: $$Props["preventScroll"] = undefined;
	export let arrowSize: $$Props["arrowSize"] = undefined;
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
	} = setMenuCtx({
		closeOnOutsideClick,
		closeOnEscape,
		portal,
		preventScroll,
		arrowSize,
		positioning,
		loop,
		dir,
		typeahead,
		closeFocus,
		disableFocusFirstItem,
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
	$: updateOption("preventScroll", preventScroll);
	$: updateOption("arrowSize", arrowSize);
	$: updateOption("positioning", positioning);
	$: updateOption("loop", loop);
	$: updateOption("dir", dir);
	$: updateOption("closeFocus", closeFocus);
	$: updateOption("disableFocusFirstItem", disableFocusFirstItem);
	$: updateOption("typeahead", typeahead);
</script>

<slot menuIds={ids} />
