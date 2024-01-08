import { type CreateComboboxProps, createCombobox } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index";
import { getPositioningUpdater } from "../floating/helpers";
import type { Writable } from "svelte/store";
import type { FloatingConfig } from "../floating/floating-config";
import type { FloatingProps } from "../floating/_types";

function getSelectData() {
	const NAME = "combobox" as const;
	const ITEM_NAME = "combobox-item";

	const PARTS = [
		"content",
		"menu",
		"input",
		"item",
		"label",
		"arrow",
		"hidden-input",
		"indicator"
	] as const;

	return {
		NAME,
		ITEM_NAME,
		PARTS
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function getCtx() {
	const { NAME } = getSelectData();
	return getContext<GetReturn>(NAME);
}

type Items<T> = {
	value: T;
	label?: string;
	disabled?: boolean;
};

type Props<T = unknown, M extends boolean = false> = CreateComboboxProps<T, M> & {
	items?: Items<T>[];
};

export function setCtx<T = unknown, M extends boolean = false>(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	props: Props<T, M>
) {
	const { NAME, PARTS } = getSelectData();
	const getAttrs = createBitAttrs(NAME, PARTS);

	const combobox = { ...createCombobox<T, M>(removeUndefined(props)), getAttrs };
	setContext(NAME, combobox);
	return {
		...combobox,
		updateOption: getOptionUpdater(combobox.options)
	};
}

export function setItemCtx(value: unknown) {
	const { ITEM_NAME } = getSelectData();
	const combobox = getCtx();
	setContext(ITEM_NAME, value);
	return combobox;
}

export function getItemIndicator() {
	const { ITEM_NAME } = getSelectData();
	const {
		helpers: { isSelected },
		getAttrs
	} = getCtx();
	const value = getContext<unknown>(ITEM_NAME);
	return {
		value,
		isSelected,
		getAttrs
	};
}

export function setArrow(size = 8) {
	const combobox = getCtx();
	combobox.options.arrowSize?.set(size);
	return combobox;
}

export function updatePositioning(props: FloatingProps) {
	const defaultPlacement = {
		side: "bottom",
		align: "center",
		sameWidth: true
	} satisfies FloatingProps;
	const withDefaults = { ...defaultPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning }
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}
