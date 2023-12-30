<script lang="ts" context="module">
	type T = unknown;
	type Multiple = boolean;
</script>

<script lang="ts" generics="T, Multiple extends boolean = false">
	import { derived } from "svelte/store";
	import { setCtx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props<T, Multiple>;

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
	export let items: $$Props["items"] = [];
	export let onOutsideClick: $$Props["onOutsideClick"] = undefined;

	const {
		states: { open: localOpen, selected: localSelected },
		updateOption,
		ids
	} = setCtx<T, Multiple>({
		required,
		disabled,
		preventScroll,
		loop,
		closeOnEscape,
		closeOnOutsideClick,
		portal,
		name,
		onOutsideClick,
		multiple: multiple as Multiple,
		forceVisible: true,
		defaultSelected: Array.isArray(selected)
			? ([...selected] as $$Props["selected"])
			: // eslint-disable-next-line @typescript-eslint/no-explicit-any
			  (selected as any),
		defaultOpen: open,
		onSelectedChange: (({ next }: { next: $$Props["selected"] }) => {
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}) as any,
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
				: // eslint-disable-next-line @typescript-eslint/no-explicit-any
				  (selected as any)
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
	$: updateOption("onOutsideClick", onOutsideClick);
</script>

<slot ids={$idValues} />
