import {
	getAriaDisabled,
	getAriaSelected,
	getDataDisabled,
	getDataOrientation,
	getDataSelected,
} from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { useRovingFocus, type UseRovingFocusReturn } from "$lib/internal/useRovingFocus.svelte.js";
import type { Orientation } from "$lib/shared/index.js";

type ListboxRootBaseStateProps = ReadableBoxedValues<{
	loop: boolean;
	orientation: Orientation;
	autoFocus: boolean | "first" | "last";
}>;

class ListboxRootBaseState {
	loop: ListboxRootBaseStateProps["loop"];
	orientation: ListboxRootBaseStateProps["orientation"];
	autoFocus: ListboxRootBaseStateProps["autoFocus"];
	labelNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);

	constructor(props: ListboxRootBaseStateProps) {
		this.loop = props.loop;
		this.orientation = props.orientation;
		this.autoFocus = props.autoFocus;
	}
}

type ListboxRootSingleStateProps = ListboxRootBaseStateProps &
	WritableBoxedValues<{
		value: string;
	}>;

export class ListboxRootSingleState extends ListboxRootBaseState {
	#value: ListboxRootSingleStateProps["value"];
	isMulti = false as const;

	constructor(props: ListboxRootSingleStateProps) {
		super(props);
		this.#value = props.value;
	}

	includesItem = (itemValue: string) => {
		return this.#value.value === itemValue;
	};

	toggleItem = (itemValue: string) => {
		this.#value.value = this.includesItem(itemValue) ? "" : itemValue;
	};
}

type ListboxRootMultipleStateProps = ListboxRootBaseStateProps &
	WritableBoxedValues<{
		value: string[];
	}>;

export class ListboxRootMultipleState extends ListboxRootBaseState {
	#value: ListboxRootMultipleStateProps["value"];
	isMulti = true as const;

	constructor(props: ListboxRootMultipleStateProps) {
		super(props);
		this.#value = props.value;
	}

	includesItem = (itemValue: string) => {
		return this.#value.value.includes(itemValue);
	};

	toggleItem = (itemValue: string) => {
		if (this.includesItem(itemValue)) {
			this.#value.value = this.#value.value.filter((v) => v !== itemValue);
		} else {
			this.#value.value = [...this.#value.value, itemValue];
		}
	};
}

type ListboxRootState = ListboxRootSingleState | ListboxRootMultipleState;

type ListboxContentStateProps = WithRefProps;

export class ListboxContentState {
	id: ListboxContentStateProps["id"];
	ref: ListboxContentStateProps["ref"];
	root: ListboxRootState;
	rovingFocusGroup: UseRovingFocusReturn;

	constructor(props: ListboxContentStateProps, root: ListboxRootState) {
		this.id = props.id;
		this.ref = props.ref;
		this.root = root;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
		});

		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: this.id,
			candidateSelector: "[role=option]",
			loop: this.root.loop,
			orientation: this.root.orientation,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				"data-orientation": getDataOrientation(this.root.orientation.value),
				role: "listbox",
			}) as const
	);
}

type ListboxLabelStateProps = WithRefProps;

export class ListboxLabelState {
	id: ListboxLabelStateProps["id"];
	ref: ListboxLabelStateProps["ref"];
	root: ListboxRootState;

	constructor(props: ListboxLabelStateProps, root: ListboxRootState) {
		this.id = props.id;
		this.ref = props.ref;
		this.root = root;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.root.labelNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				"data-orientation": getDataOrientation(this.root.orientation.value),
			}) as const
	);
}

type ListboxItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		label: string;
		disabled: boolean;
	}>
>;

export class ListboxItemState {
	id: ListboxItemStateProps["id"];
	ref: ListboxItemStateProps["ref"];
	value: ListboxItemStateProps["value"];
	label: ListboxItemStateProps["label"];
	disabled: ListboxItemStateProps["disabled"];
	content: ListboxContentState;

	isSelected = $derived.by(() => this.content.root.includesItem(this.value.value));

	constructor(props: ListboxItemStateProps, content: ListboxContentState) {
		this.id = props.id;
		this.ref = props.ref;
		this.value = props.value;
		this.label = props.label;
		this.disabled = props.disabled;
		this.content = content;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				role: "option",
				"data-value": this.value,
				"aria-disabled": getAriaDisabled(this.disabled.value),
				"data-disabled": getDataDisabled(this.disabled.value),
				"aria-selected": getAriaSelected(this.isSelected),
				"data-selected": getDataSelected(this.isSelected),
			}) as const
	);
}
