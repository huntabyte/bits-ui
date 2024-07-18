import { Previous } from "runed";
import { untrack } from "svelte";
import { type WritableBox, box } from "svelte-toolbelt";
import { usePasswordManagerBadge } from "./usePasswordManager.svelte.js";
import type { PinInputRootProps as RootComponentProps } from "./types.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { noop } from "$lib/internal/callbacks.js";
import { addEventListener } from "$lib/internal/events.js";
import { getDisabledAttr } from "$lib/internal/attrs.js";

export const REGEXP_ONLY_DIGITS = "^\\d+$";
export const REGEXP_ONLY_CHARS = "^[a-zA-Z]+$";
export const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$";

type PinInputRootStateProps = WithRefProps<
	WritableBoxedValues<{
		value: string;
		inputRef: HTMLInputElement | null;
	}> &
		ReadableBoxedValues<{
			inputId: string;
			disabled: boolean;
			// eslint-disable-next-line ts/no-explicit-any
			onComplete: (...args: any[]) => void;
			// eslint-disable-next-line ts/no-explicit-any
			pattern: any;
			maxLength: number;
			pushPasswordManagerStrategy: "increase-width" | "none";
			textAlign: RootComponentProps["textalign"];
			autocomplete: RootComponentProps["autocomplete"];
			inputmode: RootComponentProps["inputmode"];
		}>
>;

type PrevInputMetadata = [number | null, number | null, "none" | "forward" | "backward"];
type InitialLoad = {
	value: WritableBox<string>;
	isIOS: boolean;
};

class PinInputRootState {
	#containerId: PinInputRootStateProps["id"];
	#containerRef: PinInputRootStateProps["ref"];
	#inputId: PinInputRootStateProps["inputId"];
	#inputRef: PinInputRootStateProps["inputRef"];
	#isHoveringInput = $state(false);
	#isFocused = box(false);
	#mirrorSelectionStart = $state<number | null>(null);
	#mirrorSelectionEnd = $state<number | null>(null);
	#onComplete: PinInputRootStateProps["onComplete"];
	value: PinInputRootStateProps["value"];
	#previousValue = new Previous(() => this.value.value ?? "");
	#maxLength: PinInputRootStateProps["maxLength"];
	#disabled: PinInputRootStateProps["disabled"];
	#pattern: PinInputRootStateProps["pattern"];
	#textAlign: PinInputRootStateProps["textAlign"];
	#autocomplete: PinInputRootStateProps["autocomplete"];
	#inputmode: PinInputRootStateProps["inputmode"];
	#regexPattern = $derived.by(() => {
		if (typeof this.#pattern.value === "string") {
			return new RegExp(this.#pattern.value);
		} else {
			return this.#pattern.value;
		}
	});
	#prevInputMetadata = $state<PrevInputMetadata>([null, null, "none"]);
	#pushPasswordManagerStrategy: PinInputRootStateProps["pushPasswordManagerStrategy"];
	#pwmb: ReturnType<typeof usePasswordManagerBadge>;
	#initialLoad: InitialLoad;

	constructor(props: PinInputRootStateProps) {
		this.#containerId = props.id;
		this.#containerRef = props.ref;
		this.#pushPasswordManagerStrategy = props.pushPasswordManagerStrategy;
		this.value = props.value;
		this.#pattern = props.pattern;
		this.#maxLength = props.maxLength;
		this.#onComplete = props.onComplete;
		this.#disabled = props.disabled;
		this.#textAlign = props.textAlign;
		this.#autocomplete = props.autocomplete;
		this.#inputmode = props.inputmode;
		this.#inputRef = props.inputRef;
		this.#inputId = props.inputId;

		this.#initialLoad = {
			value: this.value,
			isIOS:
				typeof window !== "undefined" &&
				window?.CSS?.supports("-webkit-touch-callout", "none"),
		};

		this.#pwmb = usePasswordManagerBadge({
			containerRef: this.#containerRef,
			inputRef: this.#inputRef,
			isFocused: this.#isFocused,
			pushPasswordManagerStrategy: this.#pushPasswordManagerStrategy,
		});

		useRefById({
			id: this.#containerId,
			ref: this.#containerRef,
		});

		useRefById({
			id: this.#inputId,
			ref: this.#inputRef,
		});

		$effect(() => {
			let unsub = noop;
			untrack(() => {
				const input = this.#inputRef.value;
				const container = this.#containerRef.value;

				if (!input || !container) return;

				if (this.#initialLoad.value.value !== input.value) {
					this.value.value = input.value;
				}

				this.#prevInputMetadata = [
					input.selectionStart,
					input.selectionEnd,
					input.selectionDirection ?? "none",
				];

				unsub = addEventListener(
					document,
					"selectionchange",
					this.onDocumentSelectionChange,
					{ capture: true }
				);

				this.onDocumentSelectionChange();
				if (document.activeElement === input) {
					this.#isFocused.value = true;
				}

				if (!document.getElementById("pin-input-style")) {
					this.applyStyles();
				}

				const updateRootHeight = () => {
					if (container) {
						container.style.setProperty("--root-height", `${input.clientHeight}px`);
					}
				};
				updateRootHeight();

				const resizeObserver = new ResizeObserver(updateRootHeight);
				resizeObserver.observe(input);

				return () => {
					unsub();
					resizeObserver.disconnect();
				};
			});
		});

		$effect(() => {
			this.value.value;
			this.#inputRef.value;
			syncTimeouts(() => {
				const input = this.#inputRef.value;
				if (!input) return;
				// forcefully remove :autofull state
				input.dispatchEvent(new Event("input"));

				// update selection state
				const start = input.selectionStart;
				const end = input.selectionEnd;
				const dir = input.selectionDirection ?? "none";
				if (start !== null && end !== null) {
					this.#mirrorSelectionStart = start;
					this.#mirrorSelectionEnd = end;
					this.#prevInputMetadata = [start, end, dir];
				}
			});
		});

		$effect(() => {
			// invoke `onComplete` when the input is completely filled.
			const value = this.value.value;
			const prevValue = this.#previousValue.current;
			const maxLength = this.#maxLength.value;
			const onComplete = this.#onComplete.value;

			if (prevValue === undefined) return;
			if (value !== prevValue && prevValue.length < maxLength && value.length === maxLength) {
				onComplete(value);
			}
		});
	}

	#rootStyles = $derived.by(() => ({
		position: "relative",
		cursor: this.#disabled.value ? "default" : "text",
		userSelect: "none",
		WebkitUserSelect: "none",
		pointerEvents: "none",
	}));

	rootProps = $derived.by(() => ({
		id: this.#containerId.value,
		"data-pin-input-root": "",
		style: this.#rootStyles,
	}));

	inputWrapperProps = $derived.by(() => ({
		style: {
			position: "absolute",
			inset: 0,
			pointerEvents: "none",
		},
	}));

	#inputStyle = $derived.by(() => ({
		position: "absolute",
		inset: 0,
		width: this.#pwmb.willPushPwmBadge
			? `calc(100% + ${this.#pwmb.PWM_BADGE_SPACE_WIDTH})`
			: "100%",
		clipPath: this.#pwmb.willPushPwmBadge
			? `inset(0 ${this.#pwmb.PWM_BADGE_SPACE_WIDTH} 0 0)`
			: undefined,
		height: "100%",
		display: "flex",
		textAlign: this.#textAlign.value,
		opacity: "1",
		color: "transparent",
		pointerEvents: "all",
		background: "transparent",
		caretColor: "transparent",
		border: "0 solid transparent",
		outline: "0 solid transparent",
		boxShadow: "none",
		lineHeight: "1",
		letterSpacing: "-.5em",
		fontSize: "var(--root-height)",
		fontFamily: "monospace",
		fontVariantNumeric: "tabular-nums",
	}));

	applyStyles() {
		const styleEl = document.createElement("style");
		styleEl.id = "pin-input-style";
		document.head.appendChild(styleEl);

		if (styleEl.sheet) {
			const autoFillStyles =
				"background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;";

			safeInsertRule(
				styleEl.sheet,
				"[data-pin-input-input]::selection { background: transparent !important; color: transparent !important; }"
			);
			safeInsertRule(styleEl.sheet, `[data-pin-input-input]:autofill { ${autoFillStyles} }`);
			safeInsertRule(
				styleEl.sheet,
				`[data-pin-input-input]:-webkit-autofill { ${autoFillStyles} }`
			);
			// iOS
			safeInsertRule(
				styleEl.sheet,
				`@supports (-webkit-touch-callout: none) { [data-pin-input-input] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; } }`
			);
			// PWM badges
			safeInsertRule(
				styleEl.sheet,
				`[data-pin-input-input] + * { pointer-events: all !important; }`
			);
		}
	}

	onDocumentSelectionChange = () => {
		const input = this.#inputRef.value;
		const container = this.#containerRef.value;
		if (!input || !container) return;

		if (document.activeElement !== input) {
			this.#mirrorSelectionStart = null;
			this.#mirrorSelectionEnd = null;
			return;
		}

		const selStart = input.selectionStart;
		const selEnd = input.selectionEnd;
		const selDir = input.selectionDirection ?? "none";
		const maxLength = input.maxLength;
		const val = input.value;
		const prev = this.#prevInputMetadata;

		let start = -1;
		let end = -1;
		let direction: "forward" | "backward" | "none" | undefined;
		if (val.length !== 0 && selStart !== null && selEnd !== null) {
			const isSingleCaret = selStart === selEnd;
			const isInsertMode = selStart === val.length && val.length < maxLength;

			if (isSingleCaret && !isInsertMode) {
				const c = selStart;
				if (c === 0) {
					start = 0;
					end = 1;
					direction = "forward";
				} else if (c === maxLength) {
					start = c - 1;
					end = c;
					direction = "backward";
				} else if (maxLength > 1 && val.length > 1) {
					let offset = 0;
					if (prev[0] !== null && prev[1] !== null) {
						direction = c < prev[0] ? "backward" : "forward";
						const wasPreviouslyInserting = prev[0] === prev[1] && prev[0] < maxLength;
						if (direction === "backward" && !wasPreviouslyInserting) {
							offset = -1;
						}
					}

					start = offset - c;
					end = offset + c + 1;
				}
			}

			if (start !== -1 && end !== -1 && start !== end) {
				this.#inputRef.value?.setSelectionRange(start, end, direction);
			}
		}

		// finally update the state
		const s = start !== -1 ? start : selStart;
		const e = end !== -1 ? end : selEnd;
		const dir = direction ?? selDir;
		this.#mirrorSelectionStart = s;
		this.#mirrorSelectionEnd = e;
		this.#prevInputMetadata = [s, e, dir];
	};

	#oninput = (e: Event & { currentTarget: HTMLInputElement }) => {
		const newValue = e.currentTarget.value.slice(0, this.#maxLength.value);
		if (newValue.length > 0 && this.#regexPattern && !this.#regexPattern.test(newValue)) {
			e.preventDefault();
			return;
		}

		const maybeHasDeleted =
			typeof this.#previousValue.current === "string" &&
			newValue.length < this.#previousValue.current.length;

		if (maybeHasDeleted) {
			// Since cutting/deleting text doesn't trigger
			// selectionchange event, we'll have to dispatch it manually.
			// NOTE: The following line also triggers when cmd+A then pasting
			// a value with smaller length, which is not ideal for performance.
			document.dispatchEvent(new Event("selectionchange"));
		}
		this.value.value = newValue;
	};

	#onfocus = (_: FocusEvent & { currentTarget: HTMLInputElement }) => {
		const input = this.#inputRef.value;
		if (input) {
			const start = Math.min(input.value.length, this.#maxLength.value - 1);
			const end = input.value.length;
			input.setSelectionRange(start, end);
			this.#mirrorSelectionStart = start;
			this.#mirrorSelectionEnd = end;
		}
		this.#isFocused.value = true;
	};

	#onpaste = (e: ClipboardEvent & { currentTarget: HTMLInputElement }) => {
		const input = this.#inputRef.value;
		if (!this.#initialLoad.isIOS || !e.clipboardData || !input) return;
		const content = e.clipboardData.getData("text/plain");
		e.preventDefault();

		const start = input.selectionStart === null ? undefined : input.selectionStart;
		const end = input.selectionEnd === null ? undefined : input.selectionEnd;

		const isReplacing = start !== end;

		const initNewVal = this.value.value;

		const newValueUncapped = isReplacing
			? initNewVal.slice(0, start) + content + initNewVal.slice(end)
			: initNewVal.slice(0, start) + content + initNewVal.slice(start);

		const newValue = newValueUncapped.slice(0, this.#maxLength.value);

		if (newValue.length > 0 && this.#regexPattern && !this.#regexPattern.test(newValue)) {
			return;
		}

		input.value = newValue;
		this.value.value = newValue;

		const selStart = Math.min(newValue.length, this.#maxLength.value - 1);
		const selEnd = newValue.length;

		input.setSelectionRange(selStart, selEnd);
		this.#mirrorSelectionStart = selStart;
		this.#mirrorSelectionEnd = selEnd;
	};

	#onmouseover = () => {
		this.#isHoveringInput = true;
	};

	#onmouseleave = () => {
		this.#isHoveringInput = false;
	};

	#onblur = () => {
		this.#isFocused.value = false;
	};

	inputProps = $derived.by(() => ({
		id: this.#inputId.value,
		style: this.#inputStyle,
		autocomplete: this.#autocomplete.value || "one-time-code",
		"data-pin-input-input": "",
		"data-pin-input-input-mss": this.#mirrorSelectionStart,
		"data-pin-input-input-mse": this.#mirrorSelectionEnd,
		inputmode: this.#inputmode.value,
		pattern: this.#regexPattern?.source,
		maxlength: this.#maxLength.value,
		value: this.value.value,
		disabled: getDisabledAttr(this.#disabled.value),
		//
		onpaste: this.#onpaste,
		oninput: this.#oninput,
		onmouseover: this.#onmouseover,
		onmouseleave: this.#onmouseleave,
		onfocus: this.#onfocus,
		onblur: this.#onblur,
	}));

	#cells = $derived.by(() =>
		Array.from({ length: this.#maxLength.value }).map((_, idx) => {
			const isActive =
				this.#isFocused.value &&
				this.#mirrorSelectionStart !== null &&
				this.#mirrorSelectionEnd !== null &&
				((this.#mirrorSelectionStart === this.#mirrorSelectionEnd &&
					idx === this.#mirrorSelectionStart) ||
					(idx >= this.#mirrorSelectionStart && idx < this.#mirrorSelectionEnd));

			const char = this.value.value[idx] !== undefined ? this.value.value[idx] : null;

			return {
				char,
				isActive,
				hasFakeCaret: isActive && char === null,
			};
		})
	);

	snippetProps = $derived.by(() => ({
		cells: this.#cells,
		isFocused: this.#isFocused.value,
		isHovering: this.#isHoveringInput,
	}));
}

// eslint-disable-next-line ts/no-explicit-any
export function syncTimeouts(cb: (...args: any[]) => unknown): number[] {
	const t1 = setTimeout(cb, 0); // For faster machines
	const t2 = setTimeout(cb, 1_0);
	const t3 = setTimeout(cb, 5_0);
	return [t1, t2, t3];
}

function safeInsertRule(sheet: CSSStyleSheet, rule: string) {
	try {
		sheet.insertRule(rule);
	} catch {
		console.error("pin input could not insert CSS rule:", rule);
	}
}

export function usePinInput(props: PinInputRootStateProps) {
	return new PinInputRootState(props);
}
