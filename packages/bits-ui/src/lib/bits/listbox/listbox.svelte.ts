import { Previous } from "runed";
import { untrack } from "svelte";
import { afterTick, srOnlyStyles, styleToString, useRefById } from "svelte-toolbelt";
import type { InteractOutsideEvent } from "../utilities/dismissible-layer/types.js";
import { backward, forward, next, prev } from "$lib/internal/arrays.js";
import {
	getAriaExpanded,
	getAriaHidden,
	getDataDisabled,
	getDataOpenClosed,
	getDisabled,
	getRequired,
} from "$lib/internal/attrs.js";
import type { Box, ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { createContext } from "$lib/internal/create-context.js";
import { kbd } from "$lib/internal/kbd.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { noop } from "$lib/internal/noop.js";
import { addEventListener } from "$lib/internal/events.js";
import { type DOMTypeahead, useDOMTypeahead } from "$lib/internal/use-dom-typeahead.svelte.js";
import { type DataTypeahead, useDataTypeahead } from "$lib/internal/use-data-typeahead.svelte.js";

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];

export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
export const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];

export const CONTENT_MARGIN = 10;

type ListboxBaseRootStateProps = ReadableBoxedValues<{
	disabled: boolean;
	required: boolean;
	name: string;
	loop: boolean;
	scrollAlignment: "nearest" | "center";
	items: { value: string; label: string }[];
}> &
	WritableBoxedValues<{
		open: boolean;
	}> & {
		isCombobox: boolean;
	};

class ListboxBaseRootState {
	disabled: ListboxBaseRootStateProps["disabled"];
	required: ListboxBaseRootStateProps["required"];
	name: ListboxBaseRootStateProps["name"];
	loop: ListboxBaseRootStateProps["loop"];
	open: ListboxBaseRootStateProps["open"];
	scrollAlignment: ListboxBaseRootStateProps["scrollAlignment"];
	items: ListboxBaseRootStateProps["items"];
	touchedInput = $state(false);
	inputValue = $state<string>("");
	inputNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	valueId = $state("");
	highlightedNode = $state<HTMLElement | null>(null);
	highlightedValue = $derived.by(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute("data-value");
	});
	highlightedId = $derived.by(() => {
		if (!this.highlightedNode) return undefined;
		return this.highlightedNode.id;
	});
	highlightedLabel = $derived.by(() => {
		if (!this.highlightedNode) return null;
		return this.highlightedNode.getAttribute("data-label");
	});
	isUsingKeyboard = $state(false);
	isCombobox = $state(false);
	bitsAttrs: ListboxBitsAttrs;
	triggerPointerDownPos = $state.raw<{ x: number; y: number } | null>({ x: 0, y: 0 });

	constructor(props: ListboxBaseRootStateProps) {
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.loop = props.loop;
		this.open = props.open;
		this.scrollAlignment = props.scrollAlignment;
		this.isCombobox = props.isCombobox;
		this.items = props.items;

		this.bitsAttrs = getListboxBitsAttrs(this);

		$effect.pre(() => {
			if (!this.open.current) {
				this.setHighlightedNode(null);
			}
		});
	}

	setHighlightedNode = (node: HTMLElement | null) => {
		this.highlightedNode = node;
		if (node) {
			if (this.isUsingKeyboard) {
				node.scrollIntoView({ block: "nearest" });
			}
		}
	};

	getCandidateNodes = (): HTMLElement[] => {
		const node = this.contentNode;
		if (!node) return [];
		const nodes = Array.from(
			node.querySelectorAll<HTMLElement>(`[${this.bitsAttrs.item}]:not([data-disabled])`)
		);
		return nodes;
	};

	setHighlightedToFirstCandidate = () => {
		this.setHighlightedNode(null);
		const candidateNodes = this.getCandidateNodes();
		if (!candidateNodes.length) return;
		this.setHighlightedNode(candidateNodes[0]!);
	};

	getNodeByValue = (value: string): HTMLElement | null => {
		const candidateNodes = this.getCandidateNodes();
		return candidateNodes.find((node) => node.dataset.value === value) ?? null;
	};

	setOpen = (open: boolean) => {
		this.open.current = open;
	};

	toggleOpen = () => {
		this.open.current = !this.open.current;
	};

	handleOpen = () => {
		this.setOpen(true);
	};

	handleClose = () => {
		this.setHighlightedNode(null);
		this.setOpen(false);
	};

	toggleMenu = () => {
		this.toggleOpen();
	};
}

type ListboxSingleRootStateProps = ListboxBaseRootStateProps &
	WritableBoxedValues<{
		value: string;
	}>;

class ListboxSingleRootState extends ListboxBaseRootState {
	value: ListboxSingleRootStateProps["value"];
	isMulti = false as const;
	hasValue = $derived.by(() => this.value.current !== "");
	currentLabel = $derived.by(() => {
		if (!this.items.current.length) return "";
		const match = this.items.current.find((item) => item.value === this.value.current)?.label;
		return match ?? "";
	});
	candidateLabels: string[] = $derived.by(() => {
		if (!this.items.current.length) return [];
		return this.items.current.map((item) => item.label);
	});
	dataTypeaheadEnabled = $derived.by(() => {
		if (this.isMulti) return false;
		if (this.items.current.length === 0) return false;
		return true;
	});

	constructor(props: ListboxSingleRootStateProps) {
		super(props);
		this.value = props.value;

		$effect(() => {
			if (!this.open.current && this.highlightedNode) {
				this.setHighlightedNode(null);
			}
		});

		$effect(() => {
			if (!this.open.current) return;
			afterTick(() => {
				this.#setInitialHighlightedNode();
			});
		});
	}

	includesItem = (itemValue: string) => {
		return this.value.current === itemValue;
	};

	toggleItem = (itemValue: string, itemLabel: string = itemValue) => {
		this.value.current = this.includesItem(itemValue) ? "" : itemValue;
		this.inputValue = itemLabel;
	};

	#setInitialHighlightedNode = () => {
		if (this.highlightedNode) return;
		if (this.value.current !== "") {
			const node = this.getNodeByValue(this.value.current);
			if (node) {
				this.setHighlightedNode(node);
				return;
			}
		}
		// if no value is set, we want to highlight the first item
		const firstCandidate = this.getCandidateNodes()[0];
		if (!firstCandidate) return;
		this.setHighlightedNode(firstCandidate);
	};
}

type ListboxMultipleRootStateProps = ListboxBaseRootStateProps &
	WritableBoxedValues<{
		value: string[];
	}>;

class ListboxMultipleRootState extends ListboxBaseRootState {
	value: ListboxMultipleRootStateProps["value"];
	isMulti = true as const;
	hasValue = $derived.by(() => this.value.current.length > 0);

	constructor(props: ListboxMultipleRootStateProps) {
		super(props);
		this.value = props.value;

		$effect(() => {
			if (!this.open.current) return;
			afterTick(() => {
				if (!this.highlightedNode) {
					this.#setInitialHighlightedNode();
				}
			});
		});
	}

	includesItem = (itemValue: string) => {
		return this.value.current.includes(itemValue);
	};

	toggleItem = (itemValue: string, itemLabel: string = itemValue) => {
		if (this.includesItem(itemValue)) {
			this.value.current = this.value.current.filter((v) => v !== itemValue);
		} else {
			this.value.current = [...this.value.current, itemValue];
		}
		this.inputValue = itemLabel;
	};

	#setInitialHighlightedNode = () => {
		if (this.highlightedNode) return;
		if (this.value.current.length && this.value.current[0] !== "") {
			const node = this.getNodeByValue(this.value.current[0]!);
			if (node) {
				this.setHighlightedNode(node);
				return;
			}
		}
		// if no value is set, we want to highlight the first item
		const firstCandidate = this.getCandidateNodes()[0];
		if (!firstCandidate) return;
		this.setHighlightedNode(firstCandidate);
	};
}

type ListboxRootState = ListboxSingleRootState | ListboxMultipleRootState;

type ListboxInputStateProps = WithRefProps;

class ListboxInputState {
	#id: ListboxInputStateProps["id"];
	#ref: ListboxInputStateProps["ref"];
	root: ListboxRootState;

	constructor(props: ListboxInputStateProps, root: ListboxRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.inputNode = node;
			},
		});
	}

	#onkeydown = async (e: KeyboardEvent) => {
		this.root.isUsingKeyboard = true;
		if (e.key === kbd.ESCAPE) return;
		const open = this.root.open.current;
		const inputValue = this.root.inputValue;

		// prevent arrow up/down from moving the position of the cursor in the input
		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) e.preventDefault();
		if (!open) {
			if (INTERACTION_KEYS.includes(e.key)) return;
			if (e.key === kbd.TAB) return;
			if (e.key === kbd.BACKSPACE && inputValue === "") return;
			this.root.handleOpen();
			// we need to wait for a tick after the menu opens to ensure the highlighted nodes are
			// set correctly.
			afterTick(() => {
				if (this.root.hasValue) return;
				const candidateNodes = this.root.getCandidateNodes();
				if (!candidateNodes.length) return;

				if (e.key === kbd.ARROW_DOWN) {
					const firstCandidate = candidateNodes[0]!;
					this.root.setHighlightedNode(firstCandidate);
				} else if (e.key === kbd.ARROW_UP) {
					const lastCandidate = candidateNodes[candidateNodes.length - 1]!;
					this.root.setHighlightedNode(lastCandidate);
				}
			});
			return;
		}

		if (e.key === kbd.TAB) {
			this.root.handleClose();
			return;
		}

		if (e.key === kbd.ENTER && !e.isComposing) {
			e.preventDefault();
			const highlightedValue = this.root.highlightedValue;
			if (highlightedValue) {
				this.root.toggleItem(highlightedValue, this.root.highlightedLabel ?? undefined);
			}
			if (!this.root.isMulti) {
				this.root.handleClose();
			}
		}

		if (e.key === kbd.ARROW_UP && e.altKey) {
			this.root.handleClose();
		}

		if (FIRST_LAST_KEYS.includes(e.key)) {
			e.preventDefault();
			const candidateNodes = this.root.getCandidateNodes();
			const currHighlightedNode = this.root.highlightedNode;
			const currIndex = currHighlightedNode
				? candidateNodes.indexOf(currHighlightedNode)
				: -1;

			const loop = this.root.loop.current;
			let nextItem: HTMLElement | undefined;

			if (e.key === kbd.ARROW_DOWN) {
				nextItem = next(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.ARROW_UP) {
				nextItem = prev(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.PAGE_DOWN) {
				nextItem = forward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.PAGE_UP) {
				nextItem = backward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.HOME) {
				nextItem = candidateNodes[0];
			} else if (e.key === kbd.END) {
				nextItem = candidateNodes[candidateNodes.length - 1];
			}
			if (!nextItem) return;
			this.root.setHighlightedNode(nextItem);
			return;
		}

		if (INTERACTION_KEYS.includes(e.key)) return;
		if (!this.root.highlightedNode) {
			this.root.setHighlightedToFirstCandidate();
		}
		// this.root.setHighlightedToFirstCandidate();
	};

	#oninput = (e: Event & { currentTarget: HTMLInputElement }) => {
		this.root.inputValue = e.currentTarget.value;
		this.root.setHighlightedToFirstCandidate();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "combobox",
				disabled: this.root.disabled.current ? true : undefined,
				"aria-activedescendant": this.root.highlightedId,
				"aria-autocomplete": "list",
				"aria-expanded": getAriaExpanded(this.root.open.current),
				"data-state": getDataOpenClosed(this.root.open.current),
				"data-disabled": getDataDisabled(this.root.disabled.current),
				onkeydown: this.#onkeydown,
				oninput: this.#oninput,
				[this.root.bitsAttrs.input]: "",
			}) as const
	);
}

type ListboxComboTriggerStateProps = WithRefProps;

class ListboxComboTriggerState {
	#id: ListboxComboTriggerStateProps["id"];
	#ref: ListboxComboTriggerStateProps["ref"];
	root: ListboxBaseRootState;

	constructor(props: ListboxComboTriggerStateProps, root: ListboxBaseRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
			e.preventDefault();
			if (document.activeElement !== this.root.inputNode) {
				this.root.inputNode?.focus();
			}
			this.root.toggleMenu();
		}
	};

	/**
	 * `pointerdown` fires before the `focus` event, so we can prevent the default
	 * behavior of focusing the button and keep focus on the input.
	 */
	#onpointerdown = (e: MouseEvent) => {
		if (this.root.disabled.current) return;
		e.preventDefault();
		if (document.activeElement !== this.root.inputNode) {
			this.root.inputNode?.focus();
		}
		this.root.toggleMenu();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				disabled: this.root.disabled.current ? true : undefined,
				"aria-haspopup": "listbox",
				"data-state": getDataOpenClosed(this.root.open.current),
				"data-disabled": getDataDisabled(this.root.disabled.current),
				[this.root.bitsAttrs.trigger]: "",
				onpointerdown: this.#onpointerdown,
				onkeydown: this.#onkeydown,
			}) as const
	);
}

type ListboxTriggerStateProps = WithRefProps;

class ListboxTriggerState {
	#id: ListboxTriggerStateProps["id"];
	#ref: ListboxTriggerStateProps["ref"];
	root: ListboxRootState;
	#domTypeahead: DOMTypeahead;
	#dataTypeahead: DataTypeahead;

	constructor(props: ListboxTriggerStateProps, root: ListboxRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.triggerNode = node;
			},
		});

		this.#domTypeahead = useDOMTypeahead({
			getCurrentItem: () => this.root.highlightedNode,
			onMatch: (node) => {
				this.root.setHighlightedNode(node);
			},
		});

		this.#dataTypeahead = useDataTypeahead({
			getCurrentItem: () => {
				if (this.root.isMulti) return "";
				return this.root.currentLabel;
			},
			onMatch: (label: string) => {
				if (this.root.isMulti) return;
				if (!this.root.items.current) return;
				const matchedItem = this.root.items.current.find((item) => item.label === label);
				if (!matchedItem) return;
				this.root.value.current = matchedItem.value;
			},
			enabled: !this.root.isMulti && this.root.dataTypeaheadEnabled,
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		this.root.isUsingKeyboard = true;
		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) e.preventDefault();

		if (!this.root.open.current) {
			if (e.key === kbd.ENTER) {
				return;
			} else if (e.key === kbd.SPACE || e.key === kbd.ARROW_DOWN || e.key === kbd.ARROW_UP) {
				e.preventDefault();
				this.root.handleOpen();
			} else if (!this.root.isMulti && this.root.dataTypeaheadEnabled) {
				this.#dataTypeahead.handleTypeaheadSearch(e.key, this.root.candidateLabels);
				return;
			}

			// we need to wait for a tick after the menu opens to ensure
			// the highlighted nodes are set correctly
			afterTick(() => {
				if (this.root.hasValue) return;
				const candidateNodes = this.root.getCandidateNodes();
				if (!candidateNodes.length) return;

				if (e.key === kbd.ARROW_DOWN) {
					const firstCandidate = candidateNodes[0]!;
					this.root.setHighlightedNode(firstCandidate);
				} else if (e.key === kbd.ARROW_UP) {
					const lastCandidate = candidateNodes[candidateNodes.length - 1]!;
					this.root.setHighlightedNode(lastCandidate);
				}
			});
			return;
		}

		if (e.key === kbd.TAB) {
			this.root.handleClose();
			return;
		}

		if ((e.key === kbd.ENTER || e.key === kbd.SPACE) && !e.isComposing) {
			e.preventDefault();
			const highlightedValue = this.root.highlightedValue;
			if (highlightedValue) {
				this.root.toggleItem(highlightedValue, this.root.highlightedLabel ?? undefined);
			}
			if (!this.root.isMulti) {
				this.root.handleClose();
			}
		}

		if (e.key === kbd.ARROW_UP && e.altKey) {
			this.root.handleClose();
		}

		if (FIRST_LAST_KEYS.includes(e.key)) {
			e.preventDefault();
			const candidateNodes = this.root.getCandidateNodes();
			const currHighlightedNode = this.root.highlightedNode;
			const currIndex = currHighlightedNode
				? candidateNodes.indexOf(currHighlightedNode)
				: -1;

			const loop = this.root.loop.current;
			let nextItem: HTMLElement | undefined;

			if (e.key === kbd.ARROW_DOWN) {
				nextItem = next(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.ARROW_UP) {
				nextItem = prev(candidateNodes, currIndex, loop);
			} else if (e.key === kbd.PAGE_DOWN) {
				nextItem = forward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.PAGE_UP) {
				nextItem = backward(candidateNodes, currIndex, 10, loop);
			} else if (e.key === kbd.HOME) {
				nextItem = candidateNodes[0];
			} else if (e.key === kbd.END) {
				nextItem = candidateNodes[candidateNodes.length - 1];
			}
			if (!nextItem) return;
			this.root.setHighlightedNode(nextItem);
			return;
		}
		const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
		const isCharacterKey = e.key.length === 1;

		// prevent space from being considered with typeahead
		if (e.code === "Space") return;

		const candidateNodes = this.root.getCandidateNodes();

		if (e.key === kbd.TAB) return;

		if (!isModifierKey && isCharacterKey) {
			this.#domTypeahead.handleTypeaheadSearch(e.key, candidateNodes);
			return;
		}

		if (!this.root.highlightedNode) {
			this.root.setHighlightedToFirstCandidate();
		}
	};

	#handleOpen = () => {
		this.root.open.current = true;
		this.#dataTypeahead.resetTypeahead();
		this.#domTypeahead.resetTypeahead();
	};

	#handlePointerOpen = (e: PointerEvent) => {
		this.#handleOpen();
		this.root.triggerPointerDownPos = {
			x: Math.round(e.pageX),
			y: Math.round(e.pageY),
		};
	};

	#onclick = (e: MouseEvent) => {
		// While browsers generally have no issue focusing the trigger when clicking
		// on a label, Safari seems to struggle with the fact that there's no `onClick`.
		// We force `focus` in this case. Note: this doesn't create any other side-effect
		// because we are preventing default in `onpointerdown` so effectively
		// this only runs for a label 'click'
		const currTarget = e.currentTarget as HTMLElement;
		currTarget.focus();
	};

	/**
	 * `pointerdown` fires before the `focus` event, so we can prevent the default
	 * behavior of focusing the button and keep focus on the input.
	 */
	#onpointerdown = (e: PointerEvent) => {
		if (this.root.disabled.current) return;
		// prevent opening on touch down which can be triggered when scrolling on touch devices
		if (e.pointerType === "touch") return e.preventDefault();

		// prevent implicit pointer capture
		const target = e.target as HTMLElement;
		if (target?.hasPointerCapture(e.pointerId)) {
			target?.releasePointerCapture(e.pointerId);
		}

		// only call the handle if it's a left click, since pointerdown is triggered
		// by right clicks as well, but not when ctrl is pressed
		if (e.button === 0 && e.ctrlKey === false) {
			if (this.root.open.current === false) {
				this.#handlePointerOpen(e);
				e.preventDefault();
			} else {
				this.root.handleClose();
			}
		}
	};

	#onpointerup = (e: PointerEvent) => {
		e.preventDefault();
		if (e.pointerType === "touch") {
			this.#handlePointerOpen(e);
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				disabled: this.root.disabled.current ? true : undefined,
				"aria-haspopup": "listbox",
				"data-state": getDataOpenClosed(this.root.open.current),
				"data-disabled": getDataDisabled(this.root.disabled.current),
				[this.root.bitsAttrs.trigger]: "",
				onpointerdown: this.#onpointerdown,
				onkeydown: this.#onkeydown,
				onclick: this.#onclick,
				onpointerup: this.#onpointerup,
				// onclick: this.#onclick,
			}) as const
	);
}

type ListboxContentStateProps = WithRefProps;

class ListboxContentState {
	id: ListboxContentStateProps["id"];
	ref: ListboxContentStateProps["ref"];
	viewportNode = $state<HTMLElement | null>(null);
	root: ListboxRootState;
	isPositioned = $state(false);

	constructor(props: ListboxContentStateProps, root: ListboxRootState) {
		this.root = root;
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
			deps: () => this.root.open.current,
		});

		$effect(() => {
			return () => {
				this.root.contentNode = null;
			};
		});

		$effect(() => {
			if (this.root.open.current === false) {
				this.isPositioned = false;
			}
		});
	}

	#onpointermove = () => {
		this.root.isUsingKeyboard = false;
	};

	#styles = $derived.by(() => {
		if (this.root.isCombobox) {
			return {
				"--bits-combobox-content-transform-origin": "var(--bits-floating-transform-origin)",
				"--bits-combobox-content-available-width": "var(--bits-floating-available-width)",
				"--bits-combobox-content-available-height": "var(--bits-floating-available-height)",
				"--bits-combobox-anchor-width": "var(--bits-floating-anchor-width)",
				"--bits-combobox-anchor-height": "var(--bits-floating-anchor-height)",
			};
		} else {
			return {
				"--bits-listbox-content-transform-origin": "var(--bits-floating-transform-origin)",
				"--bits-listbox-content-available-width": "var(--bits-floating-available-width)",
				"--bits-listbox-content-available-height": "var(--bits-floating-available-height)",
				"--bits-listbox-anchor-width": "var(--bits-floating-anchor-width)",
				"--bits-listbox-anchor-height": "var(--bits-floating-anchor-height)",
			};
		}
	});

	handleInteractOutside = (e: InteractOutsideEvent) => {
		if (e.target === this.root.triggerNode || e.target === this.root.inputNode) {
			e.preventDefault();
		}
	};

	snippetProps = $derived.by(() => ({ open: this.root.open.current }));

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				role: "listbox",
				"data-state": getDataOpenClosed(this.root.open.current),
				[this.root.bitsAttrs.content]: "",
				style: {
					display: "flex",
					flexDirection: "column",
					outline: "none",
					boxSizing: "border-box",
					...this.#styles,
				},
				onpointermove: this.#onpointermove,
			}) as const
	);
}

type ListboxItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: string;
		disabled: boolean;
		label: string;
		onHighlight: () => void;
		onUnhighlight: () => void;
	}>
>;

class ListboxItemState {
	#id: ListboxItemStateProps["id"];
	#ref: ListboxItemStateProps["ref"];
	root: ListboxRootState;
	value: ListboxItemStateProps["value"];
	label: ListboxItemStateProps["label"];
	onHighlight: ListboxItemStateProps["onHighlight"];
	onUnhighlight: ListboxItemStateProps["onUnhighlight"];
	disabled: ListboxItemStateProps["disabled"];
	isSelected = $derived.by(() => this.root.includesItem(this.value.current));
	isHighlighted = $derived.by(() => this.root.highlightedValue === this.value.current);
	prevHighlighted = new Previous(() => this.isHighlighted);
	textId = $state("");

	constructor(props: ListboxItemStateProps, root: ListboxRootState) {
		this.root = root;
		this.value = props.value;
		this.disabled = props.disabled;
		this.label = props.label;
		this.onHighlight = props.onHighlight;
		this.onUnhighlight = props.onUnhighlight;
		this.#id = props.id;
		this.#ref = props.ref;

		$effect(() => {
			if (this.isHighlighted) {
				this.onHighlight.current();
			} else if (this.prevHighlighted.current) {
				this.onUnhighlight.current();
			}
		});

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	snippetProps = $derived.by(() => ({
		selected: this.isSelected,
		highlighted: this.isHighlighted,
	}));

	#onpointerdown = (e: PointerEvent) => {
		// prevent focus from leaving the combobox
		e.preventDefault();
	};

	/**
	 * Using `pointerup` instead of `click` allows power users to pointerdown
	 * the trigger, then release pointerup on an item to select it vs having to do
	 * multiple clicks.
	 */
	#onpointerup = (e: PointerEvent) => {
		if (e.defaultPrevented) return;
		// prevent any default behavior
		e.preventDefault();
		if (this.disabled.current) return;
		const isCurrentSelectedValue = this.value.current === this.root.value.current;
		this.root.toggleItem(this.value.current, this.label.current);

		if (!this.root.isMulti && !isCurrentSelectedValue) {
			this.root.handleClose();
		}
	};

	#onpointermove = (_: PointerEvent) => {
		if (this.root.highlightedNode !== this.#ref.current) {
			this.root.setHighlightedNode(this.#ref.current);
		}
	};

	setTextId = (id: string) => {
		this.textId = id;
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"aria-selected": this.root.includesItem(this.value.current) ? "true" : undefined,
				"data-value": this.value.current,
				"data-disabled": getDataDisabled(this.disabled.current),
				"data-highlighted":
					this.root.highlightedValue === this.value.current ? "" : undefined,
				"data-selected": this.root.includesItem(this.value.current) ? "" : undefined,
				"data-label": this.label.current,
				[this.root.bitsAttrs.item]: "",

				onpointermove: this.#onpointermove,
				onpointerdown: this.#onpointerdown,
				onpointerup: this.#onpointerup,
			}) as const
	);
}

type ListboxGroupStateProps = WithRefProps;

class ListboxGroupState {
	#id: ListboxGroupStateProps["id"];
	#ref: ListboxGroupStateProps["ref"];
	root: ListboxBaseRootState;
	labelNode = $state<HTMLElement | null>(null);

	constructor(props: ListboxGroupStateProps, root: ListboxBaseRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
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
				role: "group",
				[this.root.bitsAttrs.group]: "",
				"aria-labelledby": this.labelNode?.id ?? undefined,
			}) as const
	);
}

type ListboxGroupHeadingStateProps = WithRefProps;

class ListboxGroupHeadingState {
	#id: ListboxGroupHeadingStateProps["id"];
	#ref: ListboxGroupHeadingStateProps["ref"];
	group: ListboxGroupState;

	constructor(props: ListboxGroupHeadingStateProps, group: ListboxGroupState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.group = group;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				group.labelNode = node;
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				[this.group.root.bitsAttrs["group-label"]]: "",
			}) as const
	);
}

type ListboxHiddenInputStateProps = ReadableBoxedValues<{
	value: string;
}>;

class ListboxHiddenInputState {
	#value: ListboxHiddenInputStateProps["value"];
	root: ListboxBaseRootState;
	shouldRender = $derived.by(() => this.root.name.current !== "");

	constructor(props: ListboxHiddenInputStateProps, root: ListboxBaseRootState) {
		this.root = root;
		this.#value = props.value;
	}

	#onfocus = (e: FocusEvent) => {
		e.preventDefault();

		if (!this.root.isCombobox) {
			this.root.triggerNode?.focus();
		} else {
			this.root.inputNode?.focus();
		}
	};

	props = $derived.by(
		() =>
			({
				disabled: getDisabled(this.root.disabled.current),
				required: getRequired(this.root.required.current),
				name: this.root.name.current,
				value: this.#value.current,
				style: styleToString(srOnlyStyles),
				tabindex: -1,
				onfocus: this.#onfocus,
			}) as const
	);
}

type ListboxViewportStateProps = WithRefProps;

class ListboxViewportState {
	#id: ListboxViewportStateProps["id"];
	#ref: ListboxViewportStateProps["ref"];
	root: ListboxBaseRootState;
	content: ListboxContentState;
	prevScrollTop = $state(0);

	constructor(props: ListboxViewportStateProps, content: ListboxContentState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.content = content;
		this.root = content.root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.content.viewportNode = node;
			},
			deps: () => this.root.open.current,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "presentation",
				[this.root.bitsAttrs.viewport]: "",
				style: {
					// we use position: 'relative' here on the `viewport` so that when we call
					// `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
					// (independent of the scrollUpButton).
					position: "relative",
					flex: 1,
					overflow: "auto",
				},
			}) as const
	);
}

type ListboxScrollButtonImplStateProps = WithRefProps<ReadableBoxedValues<{ mounted: boolean }>>;

class ListboxScrollButtonImplState {
	id: ListboxScrollButtonImplStateProps["id"];
	ref: ListboxScrollButtonImplStateProps["ref"];
	content: ListboxContentState;
	root: ListboxBaseRootState;
	autoScrollTimer = $state<number | null>(null);
	onAutoScroll: () => void = noop;
	mounted: ListboxScrollButtonImplStateProps["mounted"];

	constructor(props: ListboxScrollButtonImplStateProps, content: ListboxContentState) {
		this.ref = props.ref;
		this.id = props.id;
		this.mounted = props.mounted;
		this.content = content;
		this.root = content.root;

		useRefById({
			id: this.id,
			ref: this.ref,
			deps: () => this.mounted.current,
		});

		$effect(() => {
			if (!this.mounted.current) return;
			const activeItem = untrack(() => this.root.highlightedNode);
			activeItem?.scrollIntoView({ block: "nearest" });
		});
	}

	clearAutoScrollTimer = () => {
		if (this.autoScrollTimer === null) return;
		window.clearInterval(this.autoScrollTimer);
		this.autoScrollTimer = null;
	};

	#onpointerdown = () => {
		if (this.autoScrollTimer !== null) return;
		this.autoScrollTimer = window.setInterval(() => {
			this.onAutoScroll();
		}, 50);
	};

	#onpointermove = () => {
		if (this.autoScrollTimer !== null) return;
		this.autoScrollTimer = window.setInterval(() => {
			this.onAutoScroll();
		}, 50);
	};

	#onpointerleave = () => {
		this.clearAutoScrollTimer();
	};

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"aria-hidden": getAriaHidden(true),
				style: {
					flexShrink: 0,
				},
				onpointerdown: this.#onpointerdown,
				onpointermove: this.#onpointermove,
				onpointerleave: this.#onpointerleave,
			}) as const
	);
}

class ListboxScrollDownButtonState {
	state: ListboxScrollButtonImplState;
	content: ListboxContentState;
	root: ListboxBaseRootState;
	canScrollDown = $state(false);

	constructor(state: ListboxScrollButtonImplState) {
		this.state = state;
		this.content = state.content;
		this.root = state.root;
		this.state.onAutoScroll = this.handleAutoScroll;

		$effect(() => {
			const viewport = this.content.viewportNode;
			const isPositioned = this.content.isPositioned;
			if (!viewport || !isPositioned) return;

			let cleanup = noop;

			untrack(() => {
				const handleScroll = () => {
					afterTick(() => {
						const maxScroll = viewport.scrollHeight - viewport.clientHeight;
						const paddingTop = Number.parseInt(
							getComputedStyle(viewport).paddingTop,
							10
						);

						this.canScrollDown = Math.ceil(viewport.scrollTop) < maxScroll - paddingTop;
					});
				};
				handleScroll();

				cleanup = addEventListener(viewport, "scroll", handleScroll);
			});

			return cleanup;
		});

		$effect(() => {
			if (this.state.mounted.current) return;
			this.state.clearAutoScrollTimer();
		});
	}

	handleAutoScroll = () => {
		afterTick(() => {
			const viewport = this.content.viewportNode;
			const selectedItem = this.root.highlightedNode;
			if (!viewport || !selectedItem) return;
			viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
		});
	};

	props = $derived.by(
		() => ({ ...this.state.props, [this.root.bitsAttrs["scroll-down-button"]]: "" }) as const
	);
}

class ListboxScrollUpButtonState {
	state: ListboxScrollButtonImplState;
	content: ListboxContentState;
	root: ListboxBaseRootState;
	canScrollUp = $state(false);

	constructor(state: ListboxScrollButtonImplState) {
		this.state = state;
		this.content = state.content;
		this.root = state.root;
		this.state.onAutoScroll = this.handleAutoScroll;

		$effect(() => {
			const viewport = this.content.viewportNode;
			const isPositioned = this.content.isPositioned;
			if (!viewport || !isPositioned) return;

			let cleanup = noop;

			untrack(() => {
				const handleScroll = () => {
					const paddingTop = Number.parseInt(getComputedStyle(viewport).paddingTop, 10);
					this.canScrollUp = viewport.scrollTop - paddingTop > 0;
				};
				handleScroll();

				cleanup = addEventListener(viewport, "scroll", handleScroll);
			});

			return cleanup;
		});

		$effect(() => {
			if (this.state.mounted.current) return;
			this.state.clearAutoScrollTimer();
		});
	}

	handleAutoScroll = () => {
		afterTick(() => {
			const viewport = this.content.viewportNode;
			const selectedItem = this.root.highlightedNode;
			if (!viewport || !selectedItem) return;
			viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
		});
	};

	props = $derived.by(
		() => ({ ...this.state.props, [this.root.bitsAttrs["scroll-up-button"]]: "" }) as const
	);
}

type InitListboxProps = {
	type: "single" | "multiple";
	value: Box<string> | Box<string[]>;
} & ReadableBoxedValues<{
	disabled: boolean;
	required: boolean;
	loop: boolean;
	scrollAlignment: "nearest" | "center";
	name: string;
	items: { value: string; label: string }[];
}> &
	WritableBoxedValues<{
		open: boolean;
	}> & {
		isCombobox: boolean;
	};

const [setListboxRootContext, getListboxRootContext] = createContext<ListboxRootState>([
	"Listbox.Root",
	"Combobox.Root",
]);

const [setListboxGroupContext, getListboxGroupContext] = createContext<ListboxGroupState>([
	"Listbox.Group",
	"Combobox.Group",
]);

const [setListboxContentContext, getListboxContentContext] = createContext<ListboxContentState>([
	"Listbox.Content",
	"Combobox.Content",
]);

export function useListboxRoot(props: InitListboxProps) {
	const { type, ...rest } = props;

	const rootState =
		type === "single"
			? new ListboxSingleRootState(rest as ListboxSingleRootStateProps)
			: new ListboxMultipleRootState(rest as ListboxMultipleRootStateProps);

	return setListboxRootContext(rootState);
}

export function useListboxInput(props: ListboxInputStateProps) {
	return new ListboxInputState(props, getListboxRootContext());
}

export function useListboxContent(props: ListboxContentStateProps) {
	return setListboxContentContext(new ListboxContentState(props, getListboxRootContext()));
}

export function useListboxTrigger(props: ListboxTriggerStateProps) {
	return new ListboxTriggerState(props, getListboxRootContext());
}

export function useListboxComboTrigger(props: ListboxComboTriggerStateProps) {
	return new ListboxComboTriggerState(props, getListboxRootContext());
}

export function useListboxItem(props: ListboxItemStateProps) {
	return new ListboxItemState(props, getListboxRootContext());
}

export function useListboxViewport(props: ListboxViewportStateProps) {
	return new ListboxViewportState(props, getListboxContentContext());
}

export function useListboxScrollUpButton(props: ListboxScrollButtonImplStateProps) {
	return new ListboxScrollUpButtonState(
		new ListboxScrollButtonImplState(props, getListboxContentContext())
	);
}

export function useListboxScrollDownButton(props: ListboxScrollButtonImplStateProps) {
	return new ListboxScrollDownButtonState(
		new ListboxScrollButtonImplState(props, getListboxContentContext())
	);
}

export function useListboxGroup(props: ListboxGroupStateProps) {
	return setListboxGroupContext(new ListboxGroupState(props, getListboxRootContext()));
}

export function useListboxGroupHeading(props: ListboxGroupHeadingStateProps) {
	return new ListboxGroupHeadingState(props, getListboxGroupContext());
}

export function useListboxHiddenInput(props: ListboxHiddenInputStateProps) {
	return new ListboxHiddenInputState(props, getListboxRootContext());
}

////////////////////////////////////
// Helpers
////////////////////////////////////

const listboxParts = [
	"trigger",
	"content",
	"item",
	"viewport",
	"scroll-up-button",
	"scroll-down-button",
	"group",
	"group-label",
	"separator",
	"arrow",
	"input",
	"content-wrapper",
	"item-text",
	"value",
] as const;

type ListboxBitsAttrs = Record<(typeof listboxParts)[number], string>;

export function getListboxBitsAttrs(root: ListboxBaseRootState): ListboxBitsAttrs {
	const isCombobox = root.isCombobox;
	const attrObj = {} as ListboxBitsAttrs;
	for (const part of listboxParts) {
		attrObj[part] = isCombobox ? `data-combobox-${part}` : `data-listbox-${part}`;
	}
	return attrObj;
}
