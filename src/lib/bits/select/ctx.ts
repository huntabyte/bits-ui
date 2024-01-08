import { type CreateSelectProps, createSelect } from "@melt-ui/svelte";
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

function getSelectData() {
	const NAME = "select" as const;
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

	return {
		NAME,
		GROUP_NAME,
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
};

type Props<T = unknown, M extends boolean = false> = CreateSelectProps<T, M> & {
	items?: Items<T>[];
};

export function setCtx<T = unknown, M extends boolean = false>(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	props: Props<T, M>
) {
	const { NAME, PARTS } = getSelectData();
	const getAttrs = createBitAttrs(NAME, PARTS);

	const select = {
		...createSelect<T, M>({ ...removeUndefined(props), forceVisible: true }),
		getAttrs
	};
	setContext(NAME, select);
	return {
		...select,
		updateOption: getOptionUpdater(select.options)
	};
}

export function setGroupCtx() {
	const { GROUP_NAME } = getSelectData();
	const id = generateId();
	setContext(GROUP_NAME, id);
	const {
		elements: { group },
		getAttrs
	} = getCtx();
	return { group, id, getAttrs };
}

export function setItemCtx(value: unknown) {
	const { ITEM_NAME } = getSelectData();
	const select = getCtx();
	setContext(ITEM_NAME, value);
	return select;
}

export function getGroupLabel() {
	const { GROUP_NAME } = getSelectData();
	const id = getContext<string>(GROUP_NAME);
	const {
		elements: { groupLabel },
		getAttrs
	} = getCtx();
	return { groupLabel, id, getAttrs };
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
	const select = getCtx();
	select.options.arrowSize?.set(size);
	return select;
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
