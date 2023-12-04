<script lang="ts">
	import { derived } from "svelte/store";
	import { setCtx } from "../ctx.js";
	import type { Props } from "../types.js";

	type T = $$Generic<unknown>;
	type Multiple = $$Generic<boolean>;

	type $$Props = Omit<Props<T, Multiple>, "multiple"> & {
		items?: Items<T>;
		multiple?: Multiple;
	};

	type Items<T> = {
		value: T;
		label?: string;
	}[];

	export let required: $$Props["required"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let preventScroll: $$Props["preventScroll"] = undefined;
	export let loop: $$Props["loop"] = undefined;
	export let closeOnEscape: $$Props["closeOnEscape"] = undefined;
	export let closeOnOutsideClick: $$Props["closeOnOutsideClick"] = undefined;
	export let portal: $$Props["portal"] = undefined;
	export let name: $$Props["name"] = undefined;
	export let multiple: $$Props["multiple"] = false as Multiple;
	export let selected: $$Props["selected"] = undefined;
	export let onSelectedChange: $$Props["onSelectedChange"] = undefined;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;
	// eslint-disable-next-line svelte/valid-compile
	export let items: $$Props["items"] = [];

	const {
		states: { open: localOpen, selected: localSelected },
		updateOption,
		ids
	} = setCtx({
		required,
		disabled,
		preventScroll,
		loop,
		closeOnEscape,
		closeOnOutsideClick,
		portal,
		name,
		multiple: multiple as Multiple,
		forceVisible: true,
		defaultSelected: Array.isArray(selected)
			? ([...selected] as $$Props["selected"])
			: selected,
		defaultOpen: open,
		onSelectedChange: ({ next }) => {
			if (Array.isArray(next)) {
				if (JSON.stringify(next) !== JSON.stringify(selected)) {
					onSelectedChange?.(next);
					selected = next;
				}
				return next;
			}

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
		},
		items
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
	$: selected !== undefined &&
		localSelected.set(
			Array.isArray(selected)
				? ([...selected] as $$Props["selected"])
				: selected
		);

	$: updateOption("required", required);
	$: updateOption("disabled", disabled);
	$: updateOption("preventScroll", preventScroll);
	$: updateOption("loop", loop);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: updateOption("closeOnOutsideClick", closeOnOutsideClick);
	$: updateOption("portal", portal);
	$: updateOption("name", name);
	$: updateOption("multiple", multiple);
</script>

<slot ids={$idValues} />
