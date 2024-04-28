import { box } from "runed";
import { TOOLTIP_OPEN_EVENT } from "./utils.js";
import {
	type ReadableBoxedValues,
	type WritableBoxedValues,
	watch,
} from "$lib/internal/box.svelte.js";
import { useTimeoutFn } from "$lib/internal/useTimeoutFn.svelte.js";

type TooltipProviderStateProps = ReadableBoxedValues<{
	delayDuration: number;
	disableHoverableContent: boolean;
	disableCloseOnTriggerClick: boolean;
	disabled: boolean;
	ignoreNonKeyboardFocus: boolean;
	skipDelayDuration: number;
}>;

class TooltipProviderState {
	delayDuration: TooltipProviderStateProps["delayDuration"];
	disableHoverableContent: TooltipProviderStateProps["disableHoverableContent"];
	disableCloseOnTriggerClick: TooltipProviderStateProps["disableCloseOnTriggerClick"];
	disabled: TooltipProviderStateProps["disabled"];
	ignoreNonKeyboardFocus: TooltipProviderStateProps["ignoreNonKeyboardFocus"];
	skipDelayDuration: TooltipProviderStateProps["skipDelayDuration"];
	isOpenDelayed = box(true);
	isPointerInTransit = box(false);
	#timerFn: ReturnType<typeof useTimeoutFn>;

	constructor(props: TooltipProviderStateProps) {
		this.delayDuration = props.delayDuration;
		this.disableHoverableContent = props.disableHoverableContent;
		this.disableCloseOnTriggerClick = props.disableCloseOnTriggerClick;
		this.disabled = props.disabled;
		this.ignoreNonKeyboardFocus = props.ignoreNonKeyboardFocus;
		this.skipDelayDuration = props.skipDelayDuration;
		this.#timerFn = useTimeoutFn(
			() => {
				this.isOpenDelayed.value = true;
			},
			this.skipDelayDuration.value,
			{ immediate: false }
		);
	}

	#startTimer() {
		this.#timerFn.start();
	}

	#clearTimer() {
		this.#timerFn.stop();
	}

	onOpen() {
		this.#clearTimer();
		this.isOpenDelayed.value = false;
	}

	onClose() {
		this.#startTimer();
	}
}

type TooltipRootStateProps = ReadableBoxedValues<{
	delayDuration: number;
	disableHoverableContent: boolean;
	disableCloseOnTriggerClick: boolean;
	disabled: boolean;
	ignoreNonKeyboardFocus: boolean;
}> &
	WritableBoxedValues<{
		open: boolean;
	}>;

class TooltipRootState {
	open: TooltipRootStateProps["open"];
	_delayDuration: TooltipRootStateProps["delayDuration"];
	_disableHoverableContent: TooltipRootStateProps["disableHoverableContent"];
	_disableCloseOnTriggerClick: TooltipRootStateProps["disableCloseOnTriggerClick"];
	_disabled: TooltipRootStateProps["disabled"];
	_ignoreNonKeyboardFocus: TooltipRootStateProps["ignoreNonKeyboardFocus"];
	provider: TooltipProviderState;
	delayDuration = box.with(() => this._delayDuration.value ?? this.provider.delayDuration.value);
	disableHoverableContent = box.with(
		() => this._disableHoverableContent.value ?? this.provider.disableHoverableContent.value
	);
	disableCloseOnTriggerClick = box.with(
		() =>
			this._disableCloseOnTriggerClick.value ?? this.provider.disableCloseOnTriggerClick.value
	);
	disabled = box.with(() => this._disabled.value ?? this.provider.disabled.value);
	ignoreNonKeyboardFocus = box.with(
		() => this._ignoreNonKeyboardFocus.value ?? this.provider.ignoreNonKeyboardFocus.value
	);
	contentNode = box<HTMLElement | null>(null);
	triggerNode = box<HTMLElement | null>(null);
	#wasOpenDelayed = $state(false);
	#timerFn: ReturnType<typeof useTimeoutFn>;
	stateAttr = $derived.by(() => {
		if (!this.open.value) return "closed";
		return this.#wasOpenDelayed ? "delayed-open" : "instant-open";
	});

	constructor(props: TooltipRootStateProps, provider: TooltipProviderState) {
		this.provider = provider;
		this.open = props.open;
		this._delayDuration = props.delayDuration;
		this._disableHoverableContent = props.disableHoverableContent;
		this._disableCloseOnTriggerClick = props.disableCloseOnTriggerClick;
		this._disabled = props.disabled;
		this._ignoreNonKeyboardFocus = props.ignoreNonKeyboardFocus;
		this.#timerFn = useTimeoutFn(
			() => {
				this.#wasOpenDelayed = true;
				this.open.value = true;
			},
			this._delayDuration.value,
			{ immediate: false }
		);

		watch(this.open, (isOpen) => {
			if (!this.provider.onClose) return;
			if (isOpen) {
				this.provider.onOpen();

				document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN_EVENT));
			} else {
				this.provider.onClose();
			}
		});
	}

	handleOpen() {
		this.#timerFn.stop();
		this.#wasOpenDelayed = false;
		this.open.value = true;
	}

	handleClose() {
		this.#timerFn.stop();
		this.open.value = false;
	}

	#handleDelayedOpen() {
		this.#timerFn.start();
	}

	onTriggerEnter() {
		this.#handleDelayedOpen();
	}

	onTriggerLeave() {
		if (this._disableHoverableContent.value) {
			this.handleClose();
		} else {
			this.#timerFn.stop();
		}
	}
}
