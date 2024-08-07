import { Previous } from "runed";
import { untrack } from "svelte";
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

// prettier-ignore
export const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];

export const FIRST_KEYS = [kbd.ARROW_DOWN, kbd.PAGE_UP, kbd.HOME];
export const LAST_KEYS = [kbd.ARROW_UP, kbd.PAGE_DOWN, kbd.END];
export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
export const SELECTION_KEYS = [kbd.ENTER, kbd.SPACE];

const LISTOX_ITEM_ATTR = "data-listbox-item";
const LISTBOX_CONTENT_ATTR = "data-listbox-content";
const LISTBOX_INPUT_ATTR = "data-listbox-input";
const LISTBOX_TRIGGER_ATTR = "data-listbox-trigger";
const LISTBOX_GROUP_ATTR = "data-listbox-group";
const LISTBOX_GROUP_LABEL_ATTR = "data-listbox-group-label";
const LISTBOX_VIEWPORT_ATTR = "data-listbox-viewport";
const LISTBOX_SCROLL_UP_BUTTON_ATTR = "data-listbox-scroll-up-button";
const LISTBOX_SCROLL_DOWN_BUTTON_ATTR = "data-listbox-scroll-down-button";

type ListboxBaseRootStateProps = ReadableBoxedValues<{
	disabled: boolean;
	required: boolean;
	name: string;
	loop: boolean;
	scrollAlignment: "nearest" | "center";
}> &
	WritableBoxedValues<{
		open: boolean;
	}>;

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

	constructor(props: ListboxBaseRootStateProps) {
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.loop = props.loop;
		this.open = props.open;
		this.scrollAlignment = props.scrollAlignment;

		$effect.pre(() => {
			if (!this.open.current) {
				this.setHighlightedNode(null);
			}
		});
	}

	setHighlightedNode = (node: HTMLElement | null) => {
		this.highlightedNode = node;
		if (node) {
			node.scrollIntoView({ block: "nearest" });
		}
	};

	getCandidateNodes = (): HTMLElement[] => {
		const node = this.contentNode;
		if (!node) return [];
		const nodes = Array.from(
			node.querySelectorAll<HTMLElement>(`[${LISTOX_ITEM_ATTR}]:not([data-disabled])`)
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

	// createInput(props: ListboxInputStateProps) {
	// 	return new ListboxInputState(props, this);
	// }

	createContent(props: ListboxContentStateProps) {
		return new ListboxContentState(props, this);
	}

	createTrigger(props: ListboxTriggerStateProps) {
		return new ListboxTriggerState(props, this);
	}

	createItem(props: ListboxItemStateProps) {
		return new ListboxItemState(props, this);
	}

	createGroup(props: ListboxGroupStateProps) {
		return new ListboxGroupState(props);
	}

	createHiddenInput(props: ListboxHiddenInputStateProps) {
		return new ListboxHiddenInputState(props, this);
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

	// createInput(props: ListboxInputStateProps) {
	// 	return new ListboxInputState(props, this);
	// }

	createContent(props: ListboxContentStateProps) {
		return new ListboxContentState(props, this);
	}

	createTrigger(props: ListboxTriggerStateProps) {
		return new ListboxTriggerState(props, this);
	}

	createItem(props: ListboxItemStateProps) {
		return new ListboxItemState(props, this);
	}

	createGroup(props: ListboxGroupStateProps) {
		return new ListboxGroupState(props);
	}

	createHiddenInput(props: ListboxHiddenInputStateProps) {
		return new ListboxHiddenInputState(props, this);
	}
}

type ListboxRootState = ListboxSingleRootState | ListboxMultipleRootState;

type ListboxInputStateProps = WithRefProps;

// class ListboxInputState {
// 	#id: ListboxInputStateProps["id"];
// 	#ref: ListboxInputStateProps["ref"];
// 	root: ListboxRootState;

// 	constructor(props: ListboxInputStateProps, root: ListboxRootState) {
// 		this.root = root;
// 		this.#id = props.id;
// 		this.#ref = props.ref;

// 		useRefById({
// 			id: this.#id,
// 			ref: this.#ref,
// 			onRefChange: (node) => {
// 				this.root.inputNode = node;
// 			},
// 		});
// 	}

// 	#onkeydown = async (e: KeyboardEvent) => {
// 		if (e.key === kbd.ESCAPE) return;
// 		const open = this.root.open.current;
// 		const inputValue = this.root.inputValue;

// 		// prevent arrow up/down from moving the position of the cursor in the input
// 		if (e.key === kbd.ARROW_UP || e.key === kbd.ARROW_DOWN) e.preventDefault();
// 		if (!open) {
// 			if (INTERACTION_KEYS.includes(e.key)) return;
// 			if (e.key === kbd.TAB) return;
// 			if (e.key === kbd.BACKSPACE && inputValue === "") return;
// 			this.root.openMenu();
// 			// we need to wait for a tick after the menu opens to ensure the highlighted nodes are
// 			// set correctly.
// 			afterTick(() => {
// 				if (this.root.hasValue) return;
// 				const candidateNodes = this.root.getCandidateNodes();
// 				if (!candidateNodes.length) return;

// 				if (e.key === kbd.ARROW_DOWN) {
// 					const firstCandidate = candidateNodes[0]!;
// 					this.root.setHighlightedNode(firstCandidate);
// 				} else if (e.key === kbd.ARROW_UP) {
// 					const lastCandidate = candidateNodes[candidateNodes.length - 1]!;
// 					this.root.setHighlightedNode(lastCandidate);
// 				}
// 			});
// 			return;
// 		}

// 		if (e.key === kbd.TAB) {
// 			this.root.closeMenu();
// 			return;
// 		}

// 		if (e.key === kbd.ENTER && !e.isComposing) {
// 			e.preventDefault();
// 			const highlightedValue = this.root.highlightedValue;
// 			if (highlightedValue) {
// 				this.root.toggleItem(highlightedValue, this.root.highlightedLabel ?? undefined);
// 			}
// 			if (!this.root.isMulti) {
// 				this.root.closeMenu();
// 			}
// 		}

// 		if (e.key === kbd.ARROW_UP && e.altKey) {
// 			this.root.closeMenu();
// 		}

// 		if (FIRST_LAST_KEYS.includes(e.key)) {
// 			e.preventDefault();
// 			const candidateNodes = this.root.getCandidateNodes();
// 			const currHighlightedNode = this.root.highlightedNode;
// 			const currIndex = currHighlightedNode
// 				? candidateNodes.indexOf(currHighlightedNode)
// 				: -1;

// 			const loop = this.root.loop.current;
// 			let nextItem: HTMLElement | undefined;

// 			if (e.key === kbd.ARROW_DOWN) {
// 				nextItem = next(candidateNodes, currIndex, loop);
// 			} else if (e.key === kbd.ARROW_UP) {
// 				nextItem = prev(candidateNodes, currIndex, loop);
// 			} else if (e.key === kbd.PAGE_DOWN) {
// 				nextItem = forward(candidateNodes, currIndex, 10, loop);
// 			} else if (e.key === kbd.PAGE_UP) {
// 				nextItem = backward(candidateNodes, currIndex, 10, loop);
// 			} else if (e.key === kbd.HOME) {
// 				nextItem = candidateNodes[0];
// 			} else if (e.key === kbd.END) {
// 				nextItem = candidateNodes[candidateNodes.length - 1];
// 			}
// 			if (!nextItem) return;
// 			this.root.setHighlightedNode(nextItem);
// 			return;
// 		}

// 		if (INTERACTION_KEYS.includes(e.key)) return;
// 		if (!this.root.highlightedNode) {
// 			this.root.setHighlightedToFirstCandidate();
// 		}
// 		// this.root.setHighlightedToFirstCandidate();
// 	};

// 	#oninput = (e: Event & { currentTarget: HTMLInputElement }) => {
// 		this.root.inputValue = e.currentTarget.value;
// 		this.root.setHighlightedToFirstCandidate();
// 	};

// 	props = $derived.by(
// 		() =>
// 			({
// 				id: this.#id.current,
// 				role: "combobox",
// 				disabled: this.root.disabled.current ? true : undefined,
// 				"aria-activedescendant": this.root.highlightedId,
// 				"aria-autocomplete": "list",
// 				"aria-expanded": getAriaExpanded(this.root.open.current),
// 				"data-state": getDataOpenClosed(this.root.open.current),
// 				"data-disabled": getDataDisabled(this.root.disabled.current),
// 				onkeydown: this.#onkeydown,
// 				oninput: this.#oninput,
// 				[LISTBOX_INPUT_ATTR]: "",
// 			}) as const
// 	);
// }

type ListboxTriggerStateProps = WithRefProps;

class ListboxTriggerState {
	#id: ListboxTriggerStateProps["id"];
	#ref: ListboxTriggerStateProps["ref"];
	root: ListboxRootState;

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
	}

	#onkeydown = (e: KeyboardEvent) => {
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
				[LISTBOX_TRIGGER_ATTR]: "",
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
	root: ListboxRootState;
	isPositioned = $state(false);

	constructor(props: ListboxContentStateProps, root: ListboxRootState) {
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

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "listbox",
				"data-state": getDataOpenClosed(this.root.open.current),
				[LISTBOX_CONTENT_ATTR]: "",
				style: {
					display: "flex",
					flexDirection: "column",
					outline: "none",
					boxSizing: "border-box",
				},
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

type ListboxViewportStateProps = WithRefProps;

class ListboxViewportState {
	#id: ListboxViewportStateProps["id"];
	#ref: ListboxViewportStateProps["ref"];
	root: ListboxRootState;
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
				[LISTBOX_VIEWPORT_ATTR]: "",
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
	root: ListboxRootState;
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
	root: ListboxRootState;
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
		() => ({ ...this.state.props, [LISTBOX_SCROLL_DOWN_BUTTON_ATTR]: "" }) as const
	);
}

class ListboxScrollUpButtonState {
	state: ListboxScrollButtonImplState;
	content: ListboxContentState;
	root: ListboxRootState;
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

	handleAutoScroll() {
		afterTick(() => {
			const viewport = this.content.viewportNode;
			const selectedItem = this.root.highlightedNode;
			if (!viewport || !selectedItem) return;
			viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
		});
	}

	props = $derived.by(
		() => ({ ...this.state.props, [LISTBOX_SCROLL_UP_BUTTON_ATTR]: "" }) as const
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

	#onpointerleave = (_: PointerEvent) => {
		// if (this.root.highlightedNode === this.#ref.current) {
		// 	this.root.setHighlightedNode(null);
		// }
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
				[LISTOX_ITEM_ATTR]: "",

				onpointermove: this.#onpointermove,
				onpointerdown: this.#onpointerdown,
				onpointerleave: this.#onpointerleave,
				onpointerup: this.#onpointerup,
			}) as const
	);
}

type ListboxGroupStateProps = WithRefProps;

class ListboxGroupState {
	#id: ListboxGroupStateProps["id"];
	#ref: ListboxGroupStateProps["ref"];
	labelNode = $state<HTMLElement | null>(null);

	constructor(props: ListboxGroupStateProps) {
		this.#id = props.id;
		this.#ref = props.ref;

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
				[LISTBOX_GROUP_ATTR]: "",
				"aria-labelledby": this.labelNode?.id ?? undefined,
			}) as const
	);

	createGroupLabel(props: ListboxGroupLabelStateProps) {
		return new ListboxGroupLabelState(props, this);
	}
}

type ListboxGroupLabelStateProps = WithRefProps;

class ListboxGroupLabelState {
	#id: ListboxGroupLabelStateProps["id"];
	#ref: ListboxGroupLabelStateProps["ref"];

	constructor(props: ListboxGroupLabelStateProps, group: ListboxGroupState) {
		this.#id = props.id;
		this.#ref = props.ref;

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
				[LISTBOX_GROUP_LABEL_ATTR]: "",
			}) as const
	);
}

type ListboxHiddenInputStateProps = ReadableBoxedValues<{
	value: string;
}>;

class ListboxHiddenInputState {
	#value: ListboxHiddenInputStateProps["value"];
	root: ListboxRootState;
	shouldRender = $derived.by(() => this.root.name.current !== "");

	constructor(props: ListboxHiddenInputStateProps, root: ListboxRootState) {
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
			}) as const
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
	}>;

const [setListboxRootContext, getListboxRootContext] =
	createContext<ListboxRootState>("Listbox.Root");

const [setListboxGroupContext, getListboxGroupContext] =
	createContext<ListboxGroupState>("Listbox.Group");

const [setListboxContentContext, getListboxContentContext] =
	createContext<ListboxContentState>("Listbox.Content");

export function useListboxRoot(props: InitListboxProps) {
	const { type, ...rest } = props;

	const rootState =
		type === "single"
			? new ListboxSingleRootState(rest as ListboxSingleRootStateProps)
			: new ListboxMultipleRootState(rest as ListboxMultipleRootStateProps);

	return setListboxRootContext(rootState);
}

// export function useListboxInput(props: ListboxInputStateProps) {
// 	return getListboxRootContext().createInput(props);
// }

export function useListboxContent(props: ListboxContentStateProps) {
	return setListboxContentContext(getListboxRootContext().createContent(props));
}

export function useListboxTrigger(props: ListboxTriggerStateProps) {
	return getListboxRootContext().createTrigger(props);
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

export function useListboxGroupLabel(props: ListboxGroupLabelStateProps) {
	return getListboxGroupContext().createGroupLabel(props);
}

export function useListboxHiddenInput(props: ListboxHiddenInputStateProps) {
	return getListboxRootContext().createHiddenInput(props);
}
