import { type CreateSelectProps, type Select as SelectReturn, createSelect } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import {
	createBitAttrs,
	generateId,
	getOptionUpdater,
	removeUndefined
} from "$lib/internal/index.js";
import { getPositioningUpdater } from "../floating/helpers.js";
import type { Writable } from "svelte/store";
import type { FloatingConfig } from "../floating/floating-config.js";
import type { FloatingProps } from "../floating/_types.js";

const NAME = "select";
const GROUP_NAME = "select-group";
const ITEM_NAME = "select-item";

const PARTS = [
	"arrow",
	"content",
	"group",
	"item",
	"indicator",
	"input",
	"label",
	"trigger",
	"value"
] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = SelectReturn;

export function getCtx() {
	return getContext<GetReturn>(NAME);
}

type Items<T> = {
	value: T;
	label?: string;
};

type Props<T = unknown, M extends boolean = false> = CreateSelectProps<T, M> & {
	items?: Items<T>[];
};

export function setCtx<T = unknown, M extends boolean = false>(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	props: Props<T, M>
) {
	const select = createSelect<T, M>(removeUndefined(props));
	setContext(NAME, select);
	return {
		...select,
		updateOption: getOptionUpdater(select.options)
	};
}

export function setGroupCtx() {
	const id = generateId();
	setContext(GROUP_NAME, id);
	const {
		elements: { group }
	} = getCtx();
	return { group, id };
}

export function setItemCtx(value: unknown) {
	const select = getCtx();
	setContext(ITEM_NAME, value);
	return select;
}

export function getGroupLabel() {
	const id = getContext<string>(GROUP_NAME);
	const {
		elements: { groupLabel }
	} = getCtx();
	return { groupLabel, id };
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
	const select = getCtx();
	select.options.arrowSize?.set(size);
	return select;
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
