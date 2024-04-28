import { box } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useTimeoutFn } from "$lib/internal/useTimeoutFn.svelte.js";

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
	delayDuration: TooltipRootStateProps["delayDuration"];
	disableHoverableContent: TooltipRootStateProps["disableHoverableContent"];
	disableCloseOnTriggerClick: TooltipRootStateProps["disableCloseOnTriggerClick"];
	disabled: TooltipRootStateProps["disabled"];
	ignoreNonKeyboardFocus: TooltipRootStateProps["ignoreNonKeyboardFocus"];
	contentNode = box<HTMLElement | null>(null);
	triggerNode = box<HTMLElement | null>(null);
	#wasOpenDelayed = $state(false);
	#timerFn: ReturnType<typeof useTimeoutFn>;

	constructor(props: TooltipRootStateProps) {
		this.open = props.open;
		this.delayDuration = props.delayDuration;
		this.disableHoverableContent = props.disableHoverableContent;
		this.disableCloseOnTriggerClick = props.disableCloseOnTriggerClick;
		this.disabled = props.disabled;
		this.ignoreNonKeyboardFocus = props.ignoreNonKeyboardFocus;
		this.#timerFn = useTimeoutFn(
			() => {
				this.#wasOpenDelayed = true;
				this.open.value = true;
			},
			this.delayDuration.value,
			{ immediate: false }
		);
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
		if (this.disableHoverableContent.value) {
			this.handleClose();
		} else {
			this.#timerFn.stop();
		}
	}
}
