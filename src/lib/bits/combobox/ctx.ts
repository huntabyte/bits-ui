import {
	type CreateComboboxProps,
	type Combobox as ComboboxReturn,
	createCombobox
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index";
import { getPositioningUpdater } from "../floating/helpers";
import type { Writable } from "svelte/store";
import type { FloatingConfig } from "../floating/floating-config";
import type { FloatingProps } from "../floating/_types";

const NAME = "combobox";
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

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = ComboboxReturn;

export function getCtx() {
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
	const combobox = createCombobox<T, M>(removeUndefined(props));
	setContext(NAME, combobox);
	return {
		...combobox,
		updateOption: getOptionUpdater(combobox.options)
	};
}

export function setItemCtx(value: unknown) {
	const combobox = getCtx();
	setContext(ITEM_NAME, value);
	return combobox;
}

export function getItemIndicator() {
	const {
		helpers: { isSelected }
	} = getCtx();
	const value = getContext<unknown>(ITEM_NAME);
	return {
		value,
		isSelected
	};
}

export function setArrow(size = 8) {
	const combobox = getCtx();
	combobox.options.arrowSize?.set(size);
	return combobox;
}

const defaultPlacement = {
	side: "bottom",
	align: "center",
	sameWidth: true
} satisfies FloatingProps;

export function updatePositioning(props: FloatingProps) {
	const withDefaults = { ...defaultPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning }
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}
