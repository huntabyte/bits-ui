import { getAttrAndSelector, getDataOrientation } from "$lib/internal/attrs.js";
import type { Box, BoxedValues, ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";
import { useNodeById } from "$lib/internal/use-node-by-id.svelte.js";
import type { Orientation } from "$lib/shared/index.js";

const [ROOT_ATTR] = getAttrAndSelector("toggle-group-root");
const [ITEM_ATTR, ITEM_SELECTOR] = getAttrAndSelector("toggle-group-item");

type ToggleGroupBaseStateProps = ReadonlyBoxedValues<{
	id: string;
	disabled: boolean;
	rovingFocus: boolean;
	loop: boolean;
	orientation: Orientation;
}>;

class ToggleGroupBaseState {
	id = undefined as unknown as ToggleGroupBaseStateProps["id"];
	node: Box<HTMLElement | null>;
	disabled = undefined as unknown as ToggleGroupBaseStateProps["disabled"];
	rovingFocus = undefined as unknown as ToggleGroupBaseStateProps["rovingFocus"];
	loop = undefined as unknown as ToggleGroupBaseStateProps["loop"];
	orientation = undefined as unknown as ToggleGroupBaseStateProps["orientation"];

	constructor(props: ToggleGroupBaseStateProps) {
		this.id = props.id;
		this.node = useNodeById(this.id);
		this.disabled = props.disabled;
		this.rovingFocus = props.rovingFocus;
		this.loop = props.loop;
		this.orientation = props.orientation;
	}

	getItemNodes() {
		const node = this.node.value;
		if (!node) return [];
		return Array.from(node.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
			(el) => !el.hasAttribute("data-disabled")
		);
	}

	props = $derived({
		id: this.id.value,
		[ROOT_ATTR]: "",
		role: "group",
		"data-orientation": getDataOrientation(this.orientation.value),
	} as const);
}

//
// SINGLE
//

type ToggleGroupSingleStateProps = ToggleGroupBaseStateProps &
	BoxedValues<{
		value: string;
	}>;

class ToggleGroupSingleState extends ToggleGroupBaseState {
	value = undefined as unknown as ToggleGroupSingleStateProps["value"];

	constructor(props: ToggleGroupSingleStateProps) {
		super(props);
		this.value = props.value;
	}

	includesItem(item: string) {
		return this.value.value === item;
	}

	toggleItem(item: string) {
		this.value.value = this.includesItem(item) ? "" : item;
	}
}

//
// MULTIPLE
//

type ToggleGroupMultipleStateProps = ToggleGroupBaseStateProps &
	BoxedValues<{
		value: string[];
	}>;

class ToggleGroupMultipleState extends ToggleGroupBaseState {
	value = undefined as unknown as ToggleGroupMultipleStateProps["value"];

	constructor(props: ToggleGroupMultipleStateProps) {
		super(props);
		this.value = props.value;
	}

	includesItem(item: string) {
		return this.value.value.includes(item);
	}

	toggleItem(item: string) {
		if (this.includesItem(item)) {
			this.value.value = this.value.value.filter((v) => v !== item);
		} else {
			this.value.value.push(item);
		}
	}
}

type ToggleGroupState = ToggleGroupSingleState | ToggleGroupMultipleState;

//
// ITEM
//

type ToggleGroupItemStateProps = ReadonlyBoxedValues<{
	id: string;
	value: string;
	disabled: boolean;
}> & {
	rootState: ToggleGroupState;
};

class ToggleGroupItemState {
	id = undefined as unknown as ToggleGroupItemStateProps["id"];
	root = undefined as unknown as ToggleGroupItemStateProps["rootState"];
	value = undefined as unknown as ToggleGroupItemStateProps["value"];
	node: Box<HTMLElement | null>;
	disabled = undefined as unknown as ToggleGroupItemStateProps["disabled"];

	constructor(props: ToggleGroupItemStateProps) {
		this.value = props.value;
		this.disabled = props.disabled;
		this.root = props.rootState;
		this.id = props.id;
		this.node = useNodeById(this.id);
	}
}
