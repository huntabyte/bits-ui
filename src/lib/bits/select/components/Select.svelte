<script lang="ts">
	import { derived } from "svelte/store";
	import { setCtx } from "../ctx.js";
	import type { SelectProps } from "../types.js";

	type $$Props = SelectProps;

	export let required: $$Props["required"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let arrowSize: $$Props["arrowSize"] = undefined;
	export let preventScroll: $$Props["preventScroll"] = undefined;
	export let loop: $$Props["loop"] = undefined;
	export let closeOnEscape: $$Props["closeOnEscape"] = undefined;
	export let closeOnOutsideClick: $$Props["closeOnOutsideClick"] = undefined;
	export let portal: $$Props["portal"] = undefined;
	export let positioning: $$Props["positioning"] = undefined;
	export let name: $$Props["name"] = undefined;
	export let multiple: $$Props["multiple"] = undefined;
	export let selected: $$Props["selected"] = undefined;
	export let onSelectedChange: $$Props["onSelectedChange"] = undefined;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;
	export let forceVisible: $$Props["forceVisible"] = true;

	const {
		states: { open: localOpen, selected: localSelected },
		updateOption,
		ids
	} = setCtx({
		required,
		disabled,
		arrowSize,
		preventScroll,
		loop,
		closeOnEscape,
		closeOnOutsideClick,
		portal,
		positioning,
		name,
		multiple,
		forceVisible,
		defaultSelected: selected,
		defaultOpen: open,
		onSelectedChange: ({ next }) => {
			if (selected !== next) {
				onSelectedChange?.(next);
				selected = next;
			}
			return next;
		},
		onOpenChange: ({ next }) => {
			if (open !== next) {
				onOpenChange?.(next);
				open = next;
			}
			return next;
		}
	});

	const idValues = derived(
		[ids.menu, ids.trigger, ids.label],
		([$menuId, $triggerId, $labelId]) => ({
			menu: $menuId,
			trigger: $triggerId,
			label: $labelId
		})
	);

	$: open !== undefined && localOpen.set(open);
	$: selected !== undefined && localSelected.set(selected);

	$: updateOption("required", required);
	$: updateOption("disabled", disabled);
	$: updateOption("arrowSize", arrowSize);
	$: updateOption("preventScroll", preventScroll);
	$: updateOption("loop", loop);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
	$: updateOption("portal", portal);
	$: updateOption("positioning", positioning);
	$: updateOption("name", name);
	$: updateOption("multiple", multiple);
	$: updateOption("forceVisible", forceVisible);
</script>

<slot ids={$idValues} />
