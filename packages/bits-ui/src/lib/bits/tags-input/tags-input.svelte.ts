import type { ReadableBoxedValues, WritableBoxedValues } from "svelte-toolbelt";
import type { TagsInputBlurBehavior } from "./types.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { createContext } from "$lib/internal/createContext.js";

const ROOT_ATTR = "data-tags-input-root";
const LIST_ATTR = "data-tags-input-list";
const INPUT_ATTR = "data-tags-input-input";
const CLEAR_ATTR = "data-tags-input-clear";
const TAG_ATTR = "data-tags-input-tag";
const TAG_CONTENT_ATTR = "data-tags-input-tag-content";
const TAG_REMOVE_ATTR = "data-tags-input-tag-remove";

type TagsInputRootStateProps = WithRefProps &
	WritableBoxedValues<{
		value: string[];
	}> &
	ReadableBoxedValues<{
		delimiter: string;
		blurBehavior: TagsInputBlurBehavior;
	}>;

class TagsInputRootState {
	#ref: TagsInputRootStateProps["ref"];
	#id: TagsInputRootStateProps["id"];
	#value: TagsInputRootStateProps["value"];
	delimiter: TagsInputRootStateProps["delimiter"];
	blurBehavior: TagsInputRootStateProps["blurBehavior"];

	constructor(props: TagsInputRootStateProps) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#value = props.value;
		this.delimiter = props.delimiter;
		this.blurBehavior = props.blurBehavior;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	includesValue = (value: string) => {
		return this.#value.current.includes(value);
	};

	addValue = (value: string) => {
		this.#value.current.push(value);
	};

	removeValueByIndex = (index: number) => {
		this.#value.current.splice(index, 1);
	};

	removeValue = (value: string) => {
		this.#value.current = this.#value.current.filter((v) => v !== value);
	};

	clearValue = () => {
		this.#value.current = [];
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[ROOT_ATTR]: "",
			}) as const
	);

	createList(props: TagsInputListStateProps) {
		return new TagsInputListState(props, this);
	}

	createInput(props: TagsInputInputStateProps) {
		return new TagsInputState(props, this);
	}

	createClear(props: TagsInputClearStateProps) {
		return new TagsInputClearState(props, this);
	}
}

type TagsInputListStateProps = WithRefProps;

class TagsInputListState {
	#ref: TagsInputListStateProps["ref"];
	#id: TagsInputListStateProps["id"];
	root: TagsInputRootState;

	// TODO: We need to trigger this to turn into `polite` reactively on a timer when
	// an item is removed from/added to the list, so we'll need to hook into the add/remove events
	#ariaLive = $derived.by(() => "off");

	constructor(props: TagsInputListStateProps, root: TagsInputRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[LIST_ATTR]: "",
				role: "grid",
				"aria-atomic": "false",
				"aria-relevant": "additions",
				"aria-live": this.#ariaLive,
			}) as const
	);

	createTag(props: TagsInputTagStateProps) {
		return new TagsInputTagState(props, this);
	}
}

type TagsInputTagStateProps = WithRefProps &
	ReadableBoxedValues<{
		value: string;
		index: number;
	}>;

class TagsInputTagState {
	#ref: TagsInputTagStateProps["ref"];
	#id: TagsInputTagStateProps["id"];
	value: TagsInputTagStateProps["value"];
	index: TagsInputTagStateProps["index"];
	root: TagsInputRootState;
	list: TagsInputListState;
	contentNode = $state<HTMLElement | null>(null);

	constructor(props: TagsInputTagStateProps, list: TagsInputListState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.root = list.root;
		this.list = list;
		this.value = props.value;
		this.index = props.index;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[TAG_ATTR]: "",
				role: "row",
			}) as const
	);

	remove = () => {
		this.root.removeValueByIndex(this.index.current);
	};

	createTagContent(props: TagsInputTagContentStateProps) {
		return new TagsInputTagContentState(props, this);
	}

	createTagRemove(props: TagsInputTagRemoveStateProps) {
		return new TagsInputTagRemoveState(props, this);
	}
}

type TagsInputTagContentStateProps = WithRefProps;

class TagsInputTagContentState {
	#ref: TagsInputTagContentStateProps["ref"];
	#id: TagsInputTagContentStateProps["id"];
	#tag: TagsInputTagState;
	#root: TagsInputRootState;

	constructor(props: TagsInputTagContentStateProps, tag: TagsInputTagState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#tag = tag;
		this.#root = tag.root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#tag.contentNode = node;
			},
		});
	}

	wrapperProps = $derived.by(
		() =>
			({
				role: "gridcell",
				style: {
					display: "contents",
				},
			}) as const
	);

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[TAG_CONTENT_ATTR]: "",
				role: "gridcell",
			}) as const
	);
}

type TagsInputTagRemoveStateProps = WithRefProps;

class TagsInputTagRemoveState {
	#ref: TagsInputTagRemoveStateProps["ref"];
	#id: TagsInputTagRemoveStateProps["id"];
	#tag: TagsInputTagState;
	#root: TagsInputRootState;
	#list: TagsInputListState;
	#ariaLabelledBy = $derived.by(() => {
		if (this.#tag.contentNode && this.#tag.contentNode.id) {
			return `${this.#id.current} ${this.#tag.contentNode.id}`;
		}
		return this.#id.current;
	});

	constructor(props: TagsInputTagRemoveStateProps, tag: TagsInputTagState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#tag = tag;
		this.#root = tag.root;
		this.#list = tag.list;
	}

	#onclick = () => {
		this.#tag.remove();
	};

	wrapperProps = $derived.by(
		() =>
			({
				role: "gridcell",
				style: {
					display: "contents",
				},
			}) as const
	);

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[TAG_REMOVE_ATTR]: "",
				role: "button",
				"aria-label": "Remove",
				"aria-labelledby": this.#ariaLabelledBy,
				onclick: this.#onclick,
			}) as const
	);
}

type TagsInputInputStateProps = WithRefProps;

class TagsInputState {
	#ref: TagsInputInputStateProps["ref"];
	#id: TagsInputInputStateProps["id"];
	#root: TagsInputRootState;

	constructor(props: TagsInputInputStateProps, root: TagsInputRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onkeydown = (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
		if (e.key === "Enter") {
			this.#root.addValue(e.currentTarget.value);
			e.currentTarget.value = "";
		} else if (e.key === this.#root.delimiter.current && e.currentTarget.value) {
			this.#root.addValue(e.currentTarget.value);
			e.currentTarget.value = "";
		}
	};

	#onblur = (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
		const blurBehavior = this.#root.blurBehavior.current;
		if (blurBehavior === "add" && e.currentTarget.value !== "") {
			this.#root.addValue(e.currentTarget.value);
			e.currentTarget.value = "";
		} else if (blurBehavior === "clear") {
			e.currentTarget.value = "";
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[INPUT_ATTR]: "",
				onkeydown: this.#onkeydown,
				onblur: this.#onblur,
			}) as const
	);
}

type TagsInputClearStateProps = WithRefProps;

class TagsInputClearState {
	#ref: TagsInputClearStateProps["ref"];
	#id: TagsInputClearStateProps["id"];
	#root: TagsInputRootState;

	constructor(props: TagsInputClearStateProps, root: TagsInputRootState) {
		this.#ref = props.ref;
		this.#id = props.id;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onclick = () => {
		this.#root.clearValue();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[CLEAR_ATTR]: "",
				role: "button",
				"aria-label": "Clear",
				onclick: this.#onclick,
			}) as const
	);
}

const [setTagsInputRootContext, getTagsInputRootContext] =
	createContext<TagsInputRootState>("TagsInput.Root");

const [setTagsInputListContext, getTagsInputListContext] =
	createContext<TagsInputListState>("TagsInput.List");

const [setTagsInputTagContext, getTagsInputTagContext] =
	createContext<TagsInputTagState>("TagsInput.Tag");

export function useTagsInputRoot(props: TagsInputRootStateProps) {
	return setTagsInputRootContext(new TagsInputRootState(props));
}

export function useTagsInputList(props: TagsInputListStateProps) {
	return setTagsInputListContext(getTagsInputRootContext().createList(props));
}

export function useTagsInputTag(props: TagsInputTagStateProps) {
	return setTagsInputTagContext(getTagsInputListContext().createTag(props));
}

export function useTagsInputTagContent(props: TagsInputTagContentStateProps) {
	return getTagsInputTagContext().createTagContent(props);
}

export function useTagsInputTagRemove(props: TagsInputTagRemoveStateProps) {
	return getTagsInputTagContext().createTagRemove(props);
}

export function useTagsInputInput(props: TagsInputInputStateProps) {
	return getTagsInputRootContext().createInput(props);
}

export function useTagsInputClear(props: TagsInputClearStateProps) {
	return getTagsInputRootContext().createClear(props);
}
