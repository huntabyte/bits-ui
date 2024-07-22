import { getAriaExpanded, getDataOpenClosed } from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { addEventListener } from "$lib/internal/events.js";
import { isElement, isFocusVisible, isTouch } from "$lib/internal/is.js";
import { sleep } from "$lib/internal/sleep.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { untrack } from "svelte";
import { getTabbableCandidates } from "../utilities/focus-scope/utils.js";
import { createContext } from "$lib/internal/createContext.js";
import { useGraceArea } from "$lib/internal/useGraceArea.svelte.js";
import { box } from "svelte-toolbelt";
import { onDestroyEffect } from "$lib/internal/onDestroyEffect.svelte.js";

const CONTENT_ATTR = "data-link-preview-content";
const TRIGGER_ATTR = "data-link-preview-trigger";

type LinkPreviewRootStateProps = WritableBoxedValues<{
	open: boolean;
}> &
	ReadableBoxedValues<{
		openDelay: number;
		closeDelay: number;
	}>;

class LinkPreviewRootState {
	open: LinkPreviewRootStateProps["open"];
	openDelay: LinkPreviewRootStateProps["openDelay"];
	closeDelay: LinkPreviewRootStateProps["closeDelay"];
	hasSelection = $state(false);
	isPointerDownOnContent = $state(false);
	containsSelection = $state(false);
	timeout: number | null = null;
	contentNode = $state<HTMLElement | null>(null);
	triggerNode = $state<HTMLElement | null>(null);
	isPointerInTransit = box(false);

	constructor(props: LinkPreviewRootStateProps) {
		this.open = props.open;
		this.openDelay = props.openDelay;
		this.closeDelay = props.closeDelay;

		$effect(() => {
			if (!this.open.current) {
				untrack(() => (this.hasSelection = false));
				return;
			}

			const handlePointerUp = () => {
				this.containsSelection = false;
				this.isPointerDownOnContent = false;

				sleep(1).then(() => {
					const isSelection = document.getSelection()?.toString() !== "";

					if (isSelection) {
						this.hasSelection = true;
					} else {
						this.hasSelection = false;
					}
				});
			};

			const unsubListener = addEventListener(document, "pointerup", handlePointerUp);

			const contentNode = untrack(() => this.contentNode);
			if (!contentNode) return;
			const tabCandidates = getTabbableCandidates(contentNode);

			for (const candidate of tabCandidates) {
				candidate.setAttribute("tabindex", "-1");
			}

			return () => {
				unsubListener();
				this.hasSelection = false;
				this.isPointerDownOnContent = false;
			};
		});
	}

	clearTimeout = () => {
		if (this.timeout) {
			window.clearTimeout(this.timeout);
			this.timeout = null;
		}
	};

	handleOpen = () => {
		this.clearTimeout();
		if (this.open.current) return;
		this.timeout = window.setTimeout(() => {
			this.open.current = true;
		}, this.openDelay.current);
	};

	immediateClose = () => {
		this.clearTimeout();
		this.open.current = false;
	};

	handleClose = () => {
		this.clearTimeout();

		if (!this.isPointerDownOnContent && !this.hasSelection) {
			this.timeout = window.setTimeout(() => {
				this.open.current = false;
			}, this.closeDelay.current);
		}
	};

	createTrigger(props: LinkPreviewTriggerStateProps) {
		return new LinkPreviewTriggerState(props, this);
	}

	createContent(props: LinkPreviewContentStateProps) {
		return new LinkPreviewContentState(props, this);
	}
}

type LinkPreviewTriggerStateProps = WithRefProps;

class LinkPreviewTriggerState {
	#id: LinkPreviewTriggerStateProps["id"];
	#ref: LinkPreviewTriggerStateProps["ref"];
	#root: LinkPreviewRootState;

	constructor(props: LinkPreviewTriggerStateProps, root: LinkPreviewRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.triggerNode = node;
			},
		});
	}

	#onpointerenter = (e: PointerEvent) => {
		if (isTouch(e)) return;
		this.#root.handleOpen();
	};

	#onfocus = (e: FocusEvent & { currentTarget: HTMLElement }) => {
		if (!isFocusVisible(e.currentTarget)) return;
		this.#root.handleOpen();
	};

	#onblur = () => {
		this.#root.handleClose();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				"aria-haspopup": "dialog",
				"aria-expanded": getAriaExpanded(this.#root.open.current),
				"data-state": getDataOpenClosed(this.#root.open.current),
				"aria-controls": this.#root.contentNode?.id ?? undefined,
				role: "button",
				[TRIGGER_ATTR]: "",
				onpointerenter: this.#onpointerenter,
				onfocus: this.#onfocus,
				onblur: this.#onblur,
			}) as const
	);
}

type LinkPreviewContentStateProps = WithRefProps;

class LinkPreviewContentState {
	#id: LinkPreviewContentStateProps["id"];
	#ref: LinkPreviewContentStateProps["ref"];
	root: LinkPreviewRootState;

	constructor(props: LinkPreviewContentStateProps, root: LinkPreviewRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.contentNode = node;
			},
		});

		$effect(() => {
			if (!this.root.open.current) return;
			const { isPointerInTransit, onPointerExit } = useGraceArea(
				() => this.root.triggerNode,
				() => this.#ref.current
			);

			this.root.isPointerInTransit = isPointerInTransit;

			onPointerExit(() => {
				this.root.handleClose();
			});
		});

		onDestroyEffect(() => {
			this.root.clearTimeout();
		});
	}

	#onpointerdown = (e: PointerEvent & { currentTarget: HTMLElement }) => {
		const target = e.target;
		if (!isElement(target)) return;

		if (e.currentTarget.contains(target)) {
			this.root.containsSelection = true;
		}
		this.root.hasSelection = true;
		this.root.isPointerDownOnContent = true;
	};

	#onpointerenter = (e: PointerEvent) => {
		if (isTouch(e)) return;
		this.root.handleOpen();
	};

	#onfocusout = (e: FocusEvent) => {
		e.preventDefault();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				tabindex: -1,
				"data-state": getDataOpenClosed(this.root.open.current),
				[CONTENT_ATTR]: "",
				onpointerdown: this.#onpointerdown,
				onpointerenter: this.#onpointerenter,
				onfocusout: this.#onfocusout,
			}) as const
	);
}

const [setLinkPreviewRootContext, getLinkPreviewRootContext] =
	createContext<LinkPreviewRootState>("LinkPreview.Root");

export function useLinkPreviewRoot(props: LinkPreviewRootStateProps) {
	return setLinkPreviewRootContext(new LinkPreviewRootState(props));
}

export function useLinkPreviewTrigger(props: LinkPreviewTriggerStateProps) {
	return getLinkPreviewRootContext().createTrigger(props);
}

export function useLinkPreviewContent(props: LinkPreviewContentStateProps) {
	return getLinkPreviewRootContext().createContent(props);
}
