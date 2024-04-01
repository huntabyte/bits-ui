import { type CreateComboboxProps, createCombobox } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";
import { getPositioningUpdater } from "../floating/helpers.js";
import type { FloatingConfig } from "../floating/floating-config.js";
import type { FloatingProps } from "../floating/_types.js";
import {
	createBitAttrs,
	generateId,
	getOptionUpdater,
	removeUndefined,
} from "$lib/internal/index.js";

function getSelectData() {
	const NAME = "combobox" as const;
	const GROUP_NAME = "combobox-group";
	const ITEM_NAME = "combobox-item";

	const PARTS = [
		"content",
		"menu",
		"input",
		"item",
		"label",
		"group",
		"group-label",
		"arrow",
		"hidden-input",
		"indicator",
	] as const;

	return {
		NAME,
		GROUP_NAME,
		ITEM_NAME,
		PARTS,
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
};

type Props<T = unknown, M extends boolean = false> = CreateComboboxProps<T, M> & {
	items?: Items<T>[];
};

export function setCtx<T = unknown, M extends boolean = false>(props: Props<T, M>) {
	const { NAME, PARTS } = getSelectData();
	const getAttrs = createBitAttrs(NAME, PARTS);

	const combobox = {
		...createCombobox<T, M>({ ...removeUndefined(props), forceVisible: true }),
		getAttrs,
	};
	setContext(NAME, combobox);
	return {
		...combobox,
		updateOption: getOptionUpdater(combobox.options),
	};
}

export function setGroupCtx() {
	const { GROUP_NAME } = getSelectData();
	const id = generateId();
	setContext(GROUP_NAME, id);
	const {
		elements: { group },
		getAttrs,
	} = getCtx();
	return { group, id, getAttrs };
}

export function setItemCtx(value: unknown) {
	const { ITEM_NAME } = getSelectData();
	const combobox = getCtx();
	setContext(ITEM_NAME, value);
	return combobox;
}

export function getGroupLabel() {
	const { GROUP_NAME } = getSelectData();
	const id = getContext<string>(GROUP_NAME);
	const {
		elements: { groupLabel },
		getAttrs,
	} = getCtx();
	return { groupLabel, id, getAttrs };
}

export function getItemIndicator() {
	const { ITEM_NAME } = getSelectData();
	const {
		helpers: { isSelected },
		getAttrs,
	} = getCtx();
	const value = getContext<unknown>(ITEM_NAME);
	return {
		value,
		isSelected,
		getAttrs,
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
		sameWidth: true,
	} satisfies FloatingProps;
	const withDefaults = { ...defaultPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning },
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}
