import { Previous } from "runed";
import { untrack } from "svelte";
import { styleToString } from "svelte-toolbelt"
import type { InteractOutsideEvent } from "../utilities/dismissable-layer/types.js";
import { afterTick } from "$lib/internal/afterTick.js";
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
import { createContext } from "$lib/internal/createContext.js";
import { kbd } from "$lib/internal/kbd.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { noop } from "$lib/internal/callbacks.js";
import { addEventListener } from "$lib/internal/events.js";
import { type Typeahead, useTypeahead } from "$lib/internal/useTypeahead.svelte.js";
import { srOnlyStyles } from "$lib/internal/style.js"

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];

export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
export const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];

type ListboxBaseRootStateProps = ReadableBoxedValues<{
	disabled: boolean;
	required: boolean;
	name: string;
	loop: boolean;
	scrollAlignment: "nearest" | "center";
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
	touchedInput = $state(false);
	inputValue = $state<string>("");
	inputNode = $state<HTMLElement | null>(null);
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
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

	constructor(props: ListboxBaseRootStateProps) {
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.loop = props.loop;
		this.open = props.open;
		this.scrollAlignment = props.scrollAlignment;
		this.isCombobox = props.isCombobox;

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

	openMenu = () => {
		this.setOpen(true);
	};

	closeMenu = () => {
		this.setHighlightedNode(null);
		this.setOpen(false);
	};

	toggleMenu = () => {
		this.toggleOpen();
	};

	createComboTrigger(props: ListboxComboTriggerStateProps) {
		return new ListboxComboTriggerState(props, this);
	}

	createGroup(props: ListboxGroupStateProps) {
		return new ListboxGroupState(props, this);
	}

	createHiddenInput(props: ListboxHiddenInputStateProps) {
		return new ListboxHiddenInputState(props, this);
	}

	createContent(props: ListboxContentStateProps) {
		return new ListboxContentState(props, this);
	}
}

type ListboxSingleRootStateProps = ListboxBaseRootStateProps &
	WritableBoxedValues<{
		value: string;
	}>;

class ListboxSingleRootState extends ListboxBaseRootState {
	value: ListboxSingleRootStateProps["value"];
	isMulti = false as const;
	hasValue = $derived.by(() => this.value.current !== "");

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

	createInput(props: ListboxInputStateProps) {
		return new ListboxInputState(props, this);
	}

	createTrigger(props: ListboxTriggerStateProps) {
		return new ListboxTriggerState(props, this);
	}

	createItem(props: ListboxItemStateProps) {
		return new ListboxItemState(props, this);
	}
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

	createInput(props: ListboxInputStateProps) {
		return new ListboxInputState(props, this);
	}

	createTrigger(props: ListboxTriggerStateProps) {
		return new ListboxTriggerState(props, this);
	}

	createItem(props: ListboxItemStateProps) {
		return new ListboxItemState(props, this);
	}
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
		if (e.key === kbd.ESCAPE) return;
		const open = this.root.open.current;
		const inputValue = this.root.inputValue;

		// prevent arrow up/down from moving the position of the cursor in the input
		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) e.preventDefault();
		if (!open) {
			if (INTERACTION_KEYS.includes(e.key)) return;
			if (e.key === kbd.TAB) return;
			if (e.key === kbd.BACKSPACE && inputValue === "") return;
			this.root.openMenu();
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
			this.root.closeMenu();
			return;
		}

		if (e.key === kbd.ENTER && !e.isComposing) {
			e.preventDefault();
			const highlightedValue = this.root.highlightedValue;
			if (highlightedValue) {
				this.root.toggleItem(highlightedValue, this.root.highlightedLabel ?? undefined);
			}
			if (!this.root.isMulti) {
				this.root.closeMenu();
			}
		}

		if (e.key === kbd.ARROW_UP && e.altKey) {
			this.root.closeMenu();
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
	#typeahead: Typeahead;

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

		this.#typeahead = useTypeahead({
			getCurrentItem: () => this.root.highlightedNode,
			onMatch: (node) => {
				this.root.setHighlightedNode(node);
			},
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		this.root.isUsingKeyboard = true;
		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) e.preventDefault();

		if (!this.root.open.current) {
			if (e.key === kbd.ENTER) return;

			if (e.key === kbd.SPACE || e.key === kbd.ARROW_DOWN || e.key === kbd.ARROW_UP) {
				e.preventDefault();
				this.root.openMenu();
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
			this.root.closeMenu();
			return;
		}

		if ((e.key === kbd.ENTER || e.key === kbd.SPACE) && !e.isComposing) {
			e.preventDefault();
			const highlightedValue = this.root.highlightedValue;
			if (highlightedValue) {
				this.root.toggleItem(highlightedValue, this.root.highlightedLabel ?? undefined);
			}
			if (!this.root.isMulti) {
				this.root.closeMenu();
			}
		}

		if (e.key === kbd.ARROW_UP && e.altKey) {
			this.root.closeMenu();
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
			this.#typeahead.handleTypeaheadSearch(e.key, candidateNodes);
			return;
		}

		if (!this.root.highlightedNode) {
			this.root.setHighlightedToFirstCandidate();
		}
	};

	#onclick = (e: MouseEvent) => {
		e.preventDefault();
	};

	/**
	 * `pointerdown` fires before the `focus` event, so we can prevent the default
	 * behavior of focusing the button and keep focus on the input.
	 */
	#onpointerdown = () => {
		if (this.root.disabled.current) return;
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
				onclick: this.#onclick,
			}) as const
	);
}

type ListboxContentStateProps = WithRefProps;

class ListboxContentState {
	#id: ListboxContentStateProps["id"];
	#ref: ListboxContentStateProps["ref"];
	viewportNode = $state<HTMLElement | null>(null);
	root: ListboxBaseRootState;
	isPositioned = $state(false);

	constructor(props: ListboxContentStateProps, root: ListboxBaseRootState) {
		this.root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
			condition: () => this.root.open.current,
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
				"--bits-combobox-trigger-width": "var(--bits-floating-anchor-width)",
				"--bits-combobox-trigger-height": "var(--bits-floating-anchor-height)",
			};
		} else {
			return {
				"--bits-listbox-content-transform-origin": "var(--bits-floating-transform-origin)",
				"--bits-listbox-content-available-width": "var(--bits-floating-available-width)",
				"--bits-listbox-content-available-height": "var(--bits-floating-available-height)",
				"--bits-listbox-trigger-width": "var(--bits-floating-anchor-width)",
				"--bits-listbox-trigger-height": "var(--bits-floating-anchor-height)",
			};
		}
	});

	handleInteractOutside = (e: InteractOutsideEvent) => {
		if (e.target === this.root.triggerNode || e.target === this.root.inputNode) {
			e.preventDefault();
		}
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
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

	createViewportState = (props: ListboxViewportStateProps) => {
		return new ListboxViewportState(props, this);
	};

	createScrollUpButtonState = (props: ListboxScrollButtonImplStateProps) => {
		const state = new ListboxScrollButtonImplState(props, this);
		return new ListboxScrollUpButtonState(state);
	};

	createScrollDownButtonState = (props: ListboxScrollButtonImplStateProps) => {
		const state = new ListboxScrollButtonImplState(props, this);
		return new ListboxScrollDownButtonState(state);
	};
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
		// prevent any default behavior
		e.preventDefault();
		if (this.disabled.current) return;
		this.root.toggleItem(this.value.current, this.label.current);
		if (!this.root.isMulti) {
			this.root.closeMenu();
		}
	};

	#onpointermove = (_: PointerEvent) => {
		if (this.root.highlightedNode !== this.#ref.current) {
			this.root.setHighlightedNode(this.#ref.current);
		}
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

	createGroupHeading(props: ListboxGroupHeadingStateProps) {
		return new ListboxGroupHeadingState(props, this);
	}
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

	props = $derived.by(
		() =>
			({
				disabled: getDisabled(this.root.disabled.current),
				required: getRequired(this.root.required.current),
				name: this.root.name.current,
				value: this.#value.current,
				"aria-hidden": getAriaHidden(true),
				style: styleToString(srOnlyStyles)
			}) as const
	);
}

type ListboxViewportStateProps = WithRefProps;

class ListboxViewportState {
	#id: ListboxViewportStateProps["id"];
	#ref: ListboxViewportStateProps["ref"];
	root: ListboxBaseRootState;
	content: ListboxContentState;

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
			condition: () => this.root.open.current,
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
			condition: () => this.mounted.current,
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
	return getListboxRootContext().createInput(props);
}

export function useListboxContent(props: ListboxContentStateProps) {
	return setListboxContentContext(getListboxRootContext().createContent(props));
}

export function useListboxTrigger(props: ListboxTriggerStateProps) {
	return getListboxRootContext().createTrigger(props);
}

export function useListboxComboTrigger(props: ListboxComboTriggerStateProps) {
	return getListboxRootContext().createComboTrigger(props);
}

export function useListboxItem(props: ListboxItemStateProps) {
	return getListboxRootContext().createItem(props);
}

export function useListboxViewport(props: ListboxViewportStateProps) {
	return getListboxContentContext().createViewportState(props);
}

export function useListboxScrollUpButton(props: ListboxScrollButtonImplStateProps) {
	return getListboxContentContext().createScrollUpButtonState(props);
}

export function useListboxScrollDownButton(props: ListboxScrollButtonImplStateProps) {
	return getListboxContentContext().createScrollDownButtonState(props);
}

export function useListboxGroup(props: ListboxGroupStateProps) {
	return setListboxGroupContext(getListboxRootContext().createGroup(props));
}

export function useListboxGroupHeading(props: ListboxGroupHeadingStateProps) {
	return getListboxGroupContext().createGroupHeading(props);
}

export function useListboxHiddenInput(props: ListboxHiddenInputStateProps) {
	return getListboxRootContext().createHiddenInput(props);
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
