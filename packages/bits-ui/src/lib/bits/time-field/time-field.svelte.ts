import type { Updater } from "svelte/store";
import { CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date";
import { onDestroyEffect, attachRef } from "svelte-toolbelt";
import { onMount, untrack } from "svelte";
import { Context, watch } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import {
	getAriaDisabled,
	getAriaHidden,
	getAriaInvalid,
	getAriaReadonly,
	getDataDisabled,
	getDataInvalid,
	getDataReadonly,
} from "$lib/internal/attrs.js";
import { isBrowser, isNumberString } from "$lib/internal/is.js";
import { kbd } from "$lib/internal/kbd.js";
import { useId } from "$lib/internal/use-id.js";
import type {
	TimeSegmentObj,
	SegmentPart,
	HourCycle,
	TimeSegmentValueObj,
	TimeValidator,
	TimeOnInvalid,
	EditableTimeSegmentPart,
} from "$lib/shared/date/types.js";
import { type TimeFormatter, createTimeFormatter } from "$lib/internal/date-time/formatter.js";
import { type Announcer, getAnnouncer } from "$lib/internal/date-time/announcer.js";
import { EDITABLE_TIME_SEGMENT_PARTS } from "$lib/internal/date-time/field/parts.js";
import { toDate } from "$lib/internal/date-time/utils.js";

import type { TimeValue } from "$lib/shared/date/types.js";
import {
	areAllTimeSegmentsFilled,
	convertTimeValueToTime,
	createTimeContent,
	getISOTimeValue,
	getTimeValueFromSegments,
	initTimeSegmentStates,
	isFirstTimeSegment,
	isTimeBefore,
	removeTimeDescriptionElement,
	setTimeDescription,
} from "$lib/internal/date-time/field/time-helpers.js";
import {
	getFirstTimeSegment,
	handleTimeSegmentNavigation,
	isSegmentNavigationKey,
	moveToNextTimeSegment,
	moveToPrevTimeSegment,
} from "$lib/internal/date-time/field/segments.js";
import {
	getDefaultHourCycle,
	isAcceptableSegmentKey,
} from "$lib/internal/date-time/field/helpers.js";
import { getDefaultAutoSelectFamily } from "net";

export const TIME_FIELD_INPUT_ATTR = "data-time-field-input";
const TIME_FIELD_LABEL_ATTR = "data-time-field-label";

// Segment configuration for time segments
type SegmentConfig = {
	min: number | ((root: TimeFieldRootState) => number);
	max: number | ((root: TimeFieldRootState) => number);
	cycle: number;
	canBeZero?: boolean;
	padZero?: boolean;
};

const SEGMENT_CONFIGS: Record<"hour" | "minute" | "second", SegmentConfig> = {
	hour: {
		min: (root) => (root.opts.hourCycle.current === 12 ? 1 : 0),
		max: (root) => {
			if (root.opts.hourCycle.current === 24) return 23;
			if ("dayPeriod" in root.segmentValues && root.segmentValues.dayPeriod !== null)
				return 12;
			return 23;
		},
		cycle: 1,
		canBeZero: true,
		padZero: true,
	},
	minute: {
		min: 0,
		max: 59,
		cycle: 1,
		canBeZero: true,
		padZero: true,
	},
	second: {
		min: 0,
		max: 59,
		cycle: 1,
		canBeZero: true,
		padZero: true,
	},
};

export type TimeFieldRootStateProps<T extends TimeValue = Time> = WritableBoxedValues<{
	value: T | undefined;
	placeholder: TimeValue;
}> &
	ReadableBoxedValues<{
		readonlySegments: SegmentPart[];
		validate: TimeValidator<T> | undefined;
		onInvalid: TimeOnInvalid | undefined;
		minValue: TimeValue | undefined;
		maxValue: TimeValue | undefined;
		disabled: boolean;
		readonly: boolean;
		granularity: "hour" | "minute" | "second" | undefined;
		hourCycle: HourCycle | undefined;
		locale: string;
		hideTimeZone: boolean;
		required: boolean;
		errorMessageId: string | undefined;
		isInvalidProp: boolean | undefined;
	}>;

export class TimeFieldRootState<T extends TimeValue = Time> {
	readonly opts: TimeFieldRootStateProps<T>;
	descriptionId = useId();
	formatter: TimeFormatter;
	initialSegments: TimeSegmentObj;
	segmentValues = $state() as TimeSegmentObj;
	announcer: Announcer;
	readonlySegmentsSet = $derived.by(() => new Set(this.opts.readonlySegments.current));
	segmentStates = initTimeSegmentStates();
	#fieldNode = $state<HTMLElement | null>(null);
	#labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	validationNode = $state<HTMLElement | null>(null);
	states = initTimeSegmentStates();
	dayPeriodNode = $state<HTMLElement | null>(null);
	name = $state("");
	maxValueTime = $derived.by(() => {
		if (!this.opts.maxValue.current) return undefined;
		return convertTimeValueToTime(this.opts.maxValue.current);
	});
	minValueTime = $derived.by(() => {
		if (!this.opts.minValue.current) return undefined;
		return convertTimeValueToTime(this.opts.minValue.current);
	});
	valueTime = $derived.by(() => {
		if (!this.opts.value.current) return undefined;
		return convertTimeValueToTime(this.opts.value.current);
	});
	hourCycle = $derived.by(() => {
		if (this.opts.hourCycle.current) return this.opts.hourCycle.current;
		return getDefaultHourCycle(this.opts.locale.current);
	});

	constructor(opts: TimeFieldRootStateProps<T>) {
		this.opts = opts;
		this.formatter = createTimeFormatter(this.opts.locale.current);
		this.initialSegments = this.#initializeTimeSegmentValues();
		this.segmentValues = this.initialSegments;
		this.announcer = getAnnouncer();

		this.getFieldNode = this.getFieldNode.bind(this);
		this.updateSegment = this.updateSegment.bind(this);
		this.handleSegmentClick = this.handleSegmentClick.bind(this);
		this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this);

		$effect(() => {
			untrack(() => {
				this.initialSegments = this.#initializeTimeSegmentValues();
			});
		});

		onMount(() => {
			this.announcer = getAnnouncer();
		});

		onDestroyEffect(() => {
			removeTimeDescriptionElement(this.descriptionId);
		});

		$effect(() => {
			if (this.formatter.getLocale() === this.opts.locale.current) return;
			this.formatter.setLocale(this.opts.locale.current);
		});

		$effect(() => {
			if (this.opts.value.current) {
				const descriptionId = untrack(() => this.descriptionId);
				setTimeDescription(
					descriptionId,
					this.formatter,
					this.#toDateValue(this.opts.value.current)
				);
			}
			const placeholder = untrack(() => this.opts.placeholder.current);
			if (this.opts.value.current && placeholder !== this.opts.value.current) {
				untrack(() => {
					if (this.opts.value.current) {
						this.opts.placeholder.current = this.opts.value.current;
					}
				});
			}
		});

		if (this.opts.value.current) {
			this.syncSegmentValues(this.opts.value.current);
		}

		$effect(() => {
			this.opts.locale.current;
			if (this.opts.value.current) {
				this.syncSegmentValues(this.opts.value.current);
			}
			this.#clearUpdating();
		});

		$effect(() => {
			if (this.opts.value.current === undefined) {
				this.segmentValues = this.#initializeTimeSegmentValues();
			}
		});

		watch(
			() => this.validationStatus,
			() => {
				if (this.validationStatus !== false) {
					this.opts.onInvalid.current?.(
						this.validationStatus.reason,
						this.validationStatus.message
					);
				}
			}
		);
	}

	#initializeTimeSegmentValues(): TimeSegmentObj {
		const granularity = this.inferredGranularity;
		const segments: TimeSegmentObj = {
			hour: null,
			minute: null,
			second: null,
			dayPeriod: "AM",
		};

		if (granularity === "second") {
			segments.second = null;
		}

		if (this.opts.hourCycle.current === 12) {
			segments.dayPeriod = null;
		}

		return segments;
	}

	#toDateValue(timeValue: TimeValue): CalendarDateTime | ZonedDateTime {
		if ("calendar" in timeValue) {
			// CalendarDateTime or ZonedDateTime
			return timeValue;
		} else {
			return new CalendarDateTime(
				2000,
				1,
				1,
				timeValue.hour,
				timeValue.minute,
				timeValue.second,
				timeValue.millisecond
			);
		}
	}

	#clearUpdating() {
		this.states.hour.updating = null;
		this.states.minute.updating = null;
		this.states.second.updating = null;
		this.states.dayPeriod.updating = null;
	}

	setName(name: string) {
		this.name = name;
	}

	setFieldNode(node: HTMLElement | null) {
		this.#fieldNode = node;
	}

	getFieldNode() {
		return this.#fieldNode;
	}

	setLabelNode(node: HTMLElement | null) {
		this.#labelNode = node;
	}

	getLabelNode() {
		return this.#labelNode;
	}

	setValue(value: T | undefined) {
		this.opts.value.current = value;
	}

	syncSegmentValues(value: TimeValue) {
		const timeValues = EDITABLE_TIME_SEGMENT_PARTS.map((part) => {
			if (part === "dayPeriod") {
				if (this.states.dayPeriod.updating) {
					return [part, this.states.dayPeriod.updating];
				} else {
					return [part, this.formatter.dayPeriod(toDate(this.#toDateValue(value)))];
				}
			} else if (part === "hour") {
				if (this.states.hour.updating) {
					return [part, this.states.hour.updating];
				}

				if (value[part] !== undefined && value[part] < 10) {
					return [part, `0${value[part]}`];
				}

				if (value[part] === 0 && this.dayPeriodNode) {
					return [part, "12"];
				}
			} else if (part === "minute") {
				if (this.states.minute.updating) {
					return [part, this.states.minute.updating];
				}

				if (value[part] !== undefined && value[part] < 10) {
					return [part, `0${value[part]}`];
				}
			} else if (part === "second") {
				if (this.states.second.updating) {
					return [part, this.states.second.updating];
				}

				if (value[part] !== undefined && value[part] < 10) {
					return [part, `0${value[part]}`];
				}
			}
			return [part, `${value[part]}`];
		});

		this.segmentValues = Object.fromEntries(timeValues);
		this.#clearUpdating();
	}

	validationStatus = $derived.by(() => {
		const value = this.opts.value.current;
		if (!value) return false as const;

		const msg = this.opts.validate.current?.(value);
		if (msg) {
			return {
				reason: "custom",
				message: msg,
			} as const;
		}

		if (!this.valueTime) return false as const;

		if (this.minValueTime && isTimeBefore(this.valueTime, this.minValueTime)) {
			return {
				reason: "min",
			} as const;
		}
		if (this.maxValueTime && isTimeBefore(this.maxValueTime, this.valueTime)) {
			return {
				reason: "max",
			} as const;
		}

		return false;
	});

	isInvalid = $derived.by(() => {
		if (this.validationStatus === false) return false;
		if (this.opts.isInvalidProp.current) return true;
		return true;
	});

	inferredGranularity = $derived.by(() => {
		return this.opts.granularity.current ?? "minute";
	});

	timeRef = $derived.by(() => this.opts.value.current ?? this.opts.placeholder.current) as T;

	allSegmentContent = $derived.by(() =>
		createTimeContent({
			segmentValues: this.segmentValues,
			formatter: this.formatter,
			locale: this.opts.locale.current,
			granularity: this.inferredGranularity,
			timeRef: this.timeRef,
			hideTimeZone: this.opts.hideTimeZone.current,
			hourCycle: this.hourCycle,
		})
	);

	segmentContents = $derived.by(() => this.allSegmentContent.arr);

	sharedSegmentAttrs = {
		role: "spinbutton",
		contenteditable: "true",
		tabindex: 0,
		spellcheck: false,
		inputmode: "numeric",
		autocorrect: "off",
		enterkeyhint: "next",
		style: {
			caretColor: "transparent",
		},
	};

	#getLabelledBy(segmentId: string) {
		return `${segmentId} ${this.getLabelNode()?.id ?? ""}`;
	}

	updateSegment<T extends EditableTimeSegmentPart>(part: T, cb: Updater<TimeSegmentObj[T]>) {
		const disabled = this.opts.disabled.current;
		const readonly = this.opts.readonly.current;
		const readonlySegmentsSet = this.readonlySegmentsSet;
		if (disabled || readonly || readonlySegmentsSet.has(part)) return;

		const prev = this.segmentValues;
		let newSegmentValues: TimeSegmentObj = prev;

		if (part === "dayPeriod") {
			const next = cb(prev[part]) as TimeSegmentObj["dayPeriod"];
			this.states.dayPeriod.updating = next;
			const value = this.opts.value.current;
			if (value && "hour" in value) {
				const trueHour = value.hour;
				if (next === "AM") {
					if (trueHour >= 12) {
						prev.hour = `${trueHour - 12}`;
					}
				} else if (next === "PM") {
					if (trueHour < 12) {
						prev.hour = `${trueHour + 12}`;
					}
				}
			}
			newSegmentValues = { ...prev, [part]: next };
		} else if (part === "hour") {
			const next = cb(prev[part]) as TimeSegmentObj["hour"];
			this.states.hour.updating = next;
			if (next !== null && prev.dayPeriod !== null) {
				const dayPeriod = this.formatter.dayPeriod(
					toDate(this.#toDateValue(this.timeRef.set({ hour: Number.parseInt(next) }))),
					this.opts.hourCycle.current
				);
				if (dayPeriod === "AM" || dayPeriod === "PM") {
					prev.dayPeriod = dayPeriod;
				}
			}
			newSegmentValues = { ...prev, [part]: next };
		} else if (part === "minute") {
			const next = cb(prev[part]) as TimeSegmentObj["minute"];
			this.states.minute.updating = next;
			newSegmentValues = { ...prev, [part]: next };
		} else if (part === "second") {
			const next = cb(prev[part]) as TimeSegmentObj["second"];
			this.states.second.updating = next;
			newSegmentValues = { ...prev, [part]: next };
		}

		this.segmentValues = newSegmentValues;
		if (areAllTimeSegmentsFilled(newSegmentValues, this.#fieldNode)) {
			this.setValue(
				getTimeValueFromSegments({
					segmentObj: newSegmentValues,
					fieldNode: this.#fieldNode,
					timeRef: this.timeRef,
				})
			);
		} else {
			// this.setValue(undefined);
			// this.segmentValues = newSegmentValues;
		}
	}

	handleSegmentClick(e: BitsMouseEvent) {
		if (this.opts.disabled.current) {
			e.preventDefault();
		}
	}

	getBaseSegmentAttrs(part: SegmentPart, segmentId: string) {
		const inReadonlySegments = this.readonlySegmentsSet.has(part);
		const defaultAttrs = {
			"aria-invalid": getAriaInvalid(this.isInvalid),
			"aria-disabled": getAriaDisabled(this.opts.disabled.current),
			"aria-readonly": getAriaReadonly(this.opts.readonly.current || inReadonlySegments),
			"data-invalid": getDataInvalid(this.isInvalid),
			"data-disabled": getDataDisabled(this.opts.disabled.current),
			"data-readonly": getDataReadonly(this.opts.readonly.current || inReadonlySegments),
			"data-segment": `${part}`,
		};

		if (part === "literal") return defaultAttrs;

		const descriptionId = this.descriptionNode?.id;
		const hasDescription = isFirstTimeSegment(segmentId, this.#fieldNode) && descriptionId;
		const errorMsgId = this.opts.errorMessageId?.current;

		const describedBy = hasDescription
			? `${descriptionId} ${this.isInvalid && errorMsgId ? errorMsgId : ""}`
			: undefined;

		const contenteditable = !(
			this.opts.readonly.current ||
			inReadonlySegments ||
			this.opts.disabled.current
		);

		return {
			...defaultAttrs,
			"aria-labelledby": this.#getLabelledBy(segmentId),
			contenteditable: contenteditable ? "true" : undefined,
			"aria-describedby": describedBy,
			tabindex: this.opts.disabled.current ? undefined : 0,
		};
	}
}

// Input, Label, HiddenInput states follow the same pattern as date-field
type TimeFieldInputStateProps = WithRefProps &
	ReadableBoxedValues<{
		name: string;
	}>;

export class TimeFieldInputState {
	readonly opts: TimeFieldInputStateProps;
	readonly root: TimeFieldRootState;

	constructor(opts: TimeFieldInputStateProps, root: TimeFieldRootState) {
		this.opts = opts;
		this.root = root;

		$effect(() => {
			this.root.setName(this.opts.name.current);
		});
	}

	#ariaDescribedBy = $derived.by(() => {
		if (!isBrowser) return undefined;
		const doesDescriptionExist = document.getElementById(this.root.descriptionId);
		if (!doesDescriptionExist) return undefined;
		return this.root.descriptionId;
	});

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				"aria-labelledby": this.root.getLabelNode()?.id ?? undefined,
				"aria-describedby": this.#ariaDescribedBy,
				"aria-disabled": getAriaDisabled(this.root.opts.disabled.current),
				"data-invalid": this.root.isInvalid ? "" : undefined,
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				[TIME_FIELD_INPUT_ATTR]: "",
				...attachRef(this.opts.ref, (v) => this.root.setFieldNode(v)),
			}) as const
	);
}

class TimeFieldHiddenInputState {
	readonly root: TimeFieldRootState;
	shouldRender = $derived.by(() => this.root.name !== "");
	isoValue = $derived.by(() =>
		this.root.opts.value.current ? getISOTimeValue(this.root.opts.value.current) : undefined
	);

	constructor(root: TimeFieldRootState) {
		this.root = root;
	}

	props = $derived.by(
		() =>
			({
				name: this.root.name,
				value: this.isoValue,
				required: this.root.opts.required.current,
			}) as const
	);
}

type TimeFieldLabelStateProps = WithRefProps;

class TimeFieldLabelState {
	readonly opts: TimeFieldLabelStateProps;
	readonly root: TimeFieldRootState;

	constructor(opts: TimeFieldLabelStateProps, root: TimeFieldRootState) {
		this.opts = opts;
		this.root = root;
		this.onclick = this.onclick.bind(this);
	}

	onclick(_: BitsMouseEvent) {
		if (this.root.opts.disabled.current) return;
		const firstSegment = getFirstTimeSegment(this.root.getFieldNode());
		if (!firstSegment) return;
		firstSegment.focus();
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-invalid": getDataInvalid(this.root.isInvalid),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				[TIME_FIELD_LABEL_ATTR]: "",
				onclick: this.onclick,
				...attachRef(this.opts.ref, (v) => this.root.setLabelNode(v)),
			}) as const
	);
}

// Base class for time segments - simplified from date-field version
abstract class BaseTimeSegmentState {
	readonly opts: WithRefProps;
	readonly root: TimeFieldRootState;
	readonly announcer: Announcer;
	readonly part: string;
	readonly config: SegmentConfig;

	constructor(opts: WithRefProps, root: TimeFieldRootState, part: string, config: SegmentConfig) {
		this.opts = opts;
		this.root = root;
		this.part = part;
		this.config = config;
		this.announcer = root.announcer;
		this.onkeydown = this.onkeydown.bind(this);
		this.onfocusout = this.onfocusout.bind(this);
	}

	#getMax(): number {
		return typeof this.config.max === "function" ? this.config.max(this.root) : this.config.max;
	}

	#getMin(): number {
		return typeof this.config.min === "function" ? this.config.min(this.root) : this.config.min;
	}

	#formatValue(value: number, forDisplay = true): string {
		const str = String(value);
		if (forDisplay && this.config.padZero && str.length === 1) {
			return `0${value}`;
		}
		return str;
	}

	onkeydown(e: BitsKeyboardEvent) {
		const placeholder = this.root.opts.value.current ?? this.root.opts.placeholder.current;
		if (e.ctrlKey || e.metaKey || this.root.opts.disabled.current) return;

		if (e.key !== kbd.TAB) e.preventDefault();
		if (!isAcceptableSegmentKey(e.key)) return;

		if (isArrowUp(e.key)) {
			this.#handleArrowUp(placeholder);
			return;
		}

		if (isArrowDown(e.key)) {
			this.#handleArrowDown(placeholder);
			return;
		}

		if (isNumberString(e.key)) {
			this.#handleNumberKey(e);
			return;
		}

		if (isBackspace(e.key)) {
			this.#handleBackspace(e);
			return;
		}

		if (isSegmentNavigationKey(e.key)) {
			handleTimeSegmentNavigation(e, this.root.getFieldNode());
		}
	}

	#handleArrowUp(placeholder: TimeValue) {
		const stateKey = this.part as EditableTimeSegmentPart;
		if (stateKey in this.root.states) {
			this.root.states[stateKey].hasLeftFocus = false;
		}

		// @ts-expect-error shhh
		this.root.updateSegment(this.part, (prev: string | null) => {
			if (prev === null) {
				const next = placeholder[this.part as keyof TimeValue];
				this.announcer.announce(String(next));
				return this.#formatValue(next as number);
			}
			const current = placeholder.set({
				[this.part]: Number.parseInt(prev),
			});
			// @ts-expect-error shhh
			const next = current.cycle(this.part, this.config.cycle)[this.part as keyof TimeValue];
			this.announcer.announce(String(next));
			return this.#formatValue(next as number);
		});
	}

	#handleArrowDown(placeholder: TimeValue) {
		const stateKey = this.part as keyof typeof this.root.states;
		if (stateKey in this.root.states) {
			this.root.states[stateKey].hasLeftFocus = false;
		}

		// @ts-expect-error - this is a part
		this.root.updateSegment(this.part, (prev: string | null) => {
			if (prev === null) {
				const next = placeholder[this.part as keyof TimeValue];
				this.announcer.announce(String(next));
				return this.#formatValue(next as number);
			}
			const current = placeholder.set({
				[this.part]: Number.parseInt(prev),
			});
			// @ts-expect-error shhh
			const next = current.cycle(this.part, -this.config.cycle)[this.part as keyof TimeValue];
			this.announcer.announce(String(next));
			return this.#formatValue(next as number);
		});
	}

	#handleNumberKey(e: BitsKeyboardEvent) {
		const num = Number.parseInt(e.key);
		let moveToNext = false;
		const max = this.#getMax();
		const maxStart = Math.floor(max / 10);
		const numIsZero = num === 0;
		const stateKey = this.part as keyof typeof this.root.states;

		// @ts-expect-error this is a part
		this.root.updateSegment(this.part, (prev: string | null) => {
			if (stateKey in this.root.states && this.root.states[stateKey].hasLeftFocus) {
				prev = null;
				this.root.states[stateKey].hasLeftFocus = false;
			}

			if (prev === null) {
				if (numIsZero) {
					if (stateKey in this.root.states) {
						this.root.states[stateKey].lastKeyZero = true;
					}
					this.announcer.announce("0");
					return "0";
				}

				if (
					stateKey in this.root.states &&
					(this.root.states[stateKey].lastKeyZero || num > maxStart)
				) {
					moveToNext = true;
				}

				if (stateKey in this.root.states) {
					this.root.states[stateKey].lastKeyZero = false;
				}

				if (moveToNext && String(num).length === 1) {
					this.announcer.announce(num);
					return `0${num}`;
				}

				return `${num}`;
			}

			if (stateKey in this.root.states && this.root.states[stateKey].lastKeyZero) {
				if (num !== 0) {
					moveToNext = true;
					this.root.states[stateKey].lastKeyZero = false;
					return `0${num}`;
				}

				if (this.part === "hour" && num === 0 && this.root.opts.hourCycle.current === 24) {
					moveToNext = true;
					this.root.states[stateKey].lastKeyZero = false;
					return `00`;
				}

				if ((this.part === "minute" || this.part === "second") && num === 0) {
					moveToNext = true;
					this.root.states[stateKey].lastKeyZero = false;
					return "00";
				}

				return prev;
			}

			const total = Number.parseInt(prev + num.toString());

			if (total > max) {
				moveToNext = true;
				return `0${num}`;
			}

			moveToNext = true;
			return `${total}`;
		});

		if (moveToNext) {
			moveToNextTimeSegment(e, this.root.getFieldNode());
		}
	}

	#handleBackspace(e: BitsKeyboardEvent) {
		const stateKey = this.part as keyof typeof this.root.states;
		if (stateKey in this.root.states) {
			this.root.states[stateKey].hasLeftFocus = false;
		}

		let moveToPrev = false;
		// @ts-expect-error this is a part
		this.root.updateSegment(this.part, (prev: string | null) => {
			if (prev === null) {
				moveToPrev = true;
				this.announcer.announce(null);
				return null;
			}

			if (prev.length === 2 && prev.startsWith("0")) {
				this.announcer.announce(null);
				return null;
			}

			const str = prev.toString();
			if (str.length === 1) {
				this.announcer.announce(null);
				return null;
			}

			const next = Number.parseInt(str.slice(0, -1));
			this.announcer.announce(String(next));
			return `${next}`;
		});

		if (moveToPrev) {
			moveToPrevTimeSegment(e, this.root.getFieldNode());
		}
	}

	onfocusout(_: BitsFocusEvent) {
		const stateKey = this.part as keyof typeof this.root.states;
		if (stateKey in this.root.states) {
			this.root.states[stateKey].hasLeftFocus = true;
		}

		// Pad with zero if needed
		if (this.config.padZero) {
			// @ts-expect-error this is a part
			this.root.updateSegment(this.part, (prev: string | null) => {
				if (prev && prev.length === 1) {
					return `0${prev}`;
				}
				return prev;
			});
		}
	}

	getSegmentProps() {
		const segmentValues = this.root.segmentValues;
		const placeholder = this.root.opts.placeholder.current;
		const isEmpty = segmentValues[this.part as keyof TimeSegmentValueObj] === null;

		let value = placeholder;
		if (segmentValues[this.part as keyof TimeSegmentValueObj]) {
			value = placeholder.set({
				[this.part]: Number.parseInt(
					segmentValues[this.part as keyof TimeSegmentValueObj] as string
				),
			});
		}

		const valueNow = value[this.part as keyof TimeValue] as number;
		const valueMin = this.#getMin();
		const valueMax = this.#getMax();
		let valueText = isEmpty ? "Empty" : `${valueNow}`;

		// special handling for hour segment with dayPeriod
		if (this.part === "hour" && "dayPeriod" in segmentValues && segmentValues.dayPeriod) {
			valueText = isEmpty ? "Empty" : `${valueNow} ${segmentValues.dayPeriod}`;
		}

		return {
			"aria-label": `${this.part}, `,
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
		};
	}

	props = $derived.by(() => {
		return {
			...this.root.sharedSegmentAttrs,
			id: this.opts.id.current,
			...this.getSegmentProps(),
			onkeydown: this.onkeydown,
			onfocusout: this.onfocusout,
			onclick: this.root.handleSegmentClick,
			...this.root.getBaseSegmentAttrs(this.part as SegmentPart, this.opts.id.current),
			...attachRef(this.opts.ref),
		};
	});
}

class TimeFieldHourSegmentState extends BaseTimeSegmentState {
	constructor(opts: WithRefProps, root: TimeFieldRootState) {
		super(opts, root, "hour", SEGMENT_CONFIGS.hour);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (isNumberString(e.key)) {
			const oldUpdateSegment = this.root.updateSegment.bind(this.root);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			this.root.updateSegment = (part: any, cb: any) => {
				const result = oldUpdateSegment(part, cb);

				// after updating hour, check if we need to display "12" instead of "0"
				if (part === "hour" && "hour" in this.root.segmentValues) {
					const hourValue = this.root.segmentValues.hour;
					if (
						hourValue === "0" &&
						this.root.dayPeriodNode &&
						this.root.opts.hourCycle.current !== 24
					) {
						this.root.segmentValues.hour = "12";
					}
				}

				return result;
			};
		}

		super.onkeydown(e);

		this.root.updateSegment = this.root.updateSegment.bind(this.root);
	}
}

class TimeFieldMinuteSegmentState extends BaseTimeSegmentState {
	constructor(opts: WithRefProps, root: TimeFieldRootState) {
		super(opts, root, "minute", SEGMENT_CONFIGS.minute);
	}
}

class TimeFieldSecondSegmentState extends BaseTimeSegmentState {
	constructor(opts: WithRefProps, root: TimeFieldRootState) {
		super(opts, root, "second", SEGMENT_CONFIGS.second);
	}
}

type TimeFieldDayPeriodSegmentStateProps = WithRefProps;

class TimeFieldDayPeriodSegmentState {
	readonly opts: TimeFieldDayPeriodSegmentStateProps;
	readonly root: TimeFieldRootState;
	#announcer: Announcer;

	constructor(opts: TimeFieldDayPeriodSegmentStateProps, root: TimeFieldRootState) {
		this.opts = opts;
		this.root = root;
		this.#announcer = this.root.announcer;
		this.onkeydown = this.onkeydown.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.ctrlKey || e.metaKey || this.root.opts.disabled.current) return;

		if (e.key !== kbd.TAB) e.preventDefault();
		if (!isAcceptableDayPeriodKey(e.key)) return;

		if (isArrowUp(e.key) || isArrowDown(e.key)) {
			this.root.updateSegment("dayPeriod", (prev) => {
				if (prev === "AM") {
					const next = "PM";
					this.#announcer.announce(next);
					return next;
				}
				const next = "AM";
				this.#announcer.announce(next);
				return next;
			});
			return;
		}

		if (isBackspace(e.key)) {
			this.root.states.dayPeriod.hasLeftFocus = false;
			this.root.updateSegment("dayPeriod", () => {
				const next = "AM";
				this.#announcer.announce(next);
				return next;
			});
		}

		if (e.key === kbd.A || e.key === kbd.P || kbd.a || kbd.p) {
			this.root.updateSegment("dayPeriod", () => {
				const next = e.key === kbd.A || e.key === kbd.a ? "AM" : "PM";
				this.#announcer.announce(next);
				return next;
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleTimeSegmentNavigation(e, this.root.getFieldNode());
		}
	}

	props = $derived.by(() => {
		const segmentValues = this.root.segmentValues;
		if (!("dayPeriod" in segmentValues)) return;

		const valueMin = 0;
		const valueMax = 12;
		const valueNow = segmentValues.dayPeriod === "AM" ? 0 : 12;
		const valueText = segmentValues.dayPeriod === "AM" ? "AM" : "PM";

		return {
			...this.root.sharedSegmentAttrs,
			id: this.opts.id.current,
			inputmode: "text",
			"aria-label": "AM/PM",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.onkeydown,
			onclick: this.root.handleSegmentClick,
			...this.root.getBaseSegmentAttrs("dayPeriod", this.opts.id.current),
			...attachRef(this.opts.ref, (v) => (this.root.dayPeriodNode = v)),
		};
	});
}

// Literal segment
type TimeFieldLiteralSegmentStateProps = WithRefProps;

class TimeFieldLiteralSegmentState {
	readonly opts: TimeFieldLiteralSegmentStateProps;
	readonly root: TimeFieldRootState;

	constructor(opts: TimeFieldLiteralSegmentStateProps, root: TimeFieldRootState) {
		this.opts = opts;
		this.root = root;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-hidden": getAriaHidden(true),
				...this.root.getBaseSegmentAttrs("literal", this.opts.id.current),
				...attachRef(this.opts.ref),
			}) as const
	);
}

class TimeFieldTimeZoneSegmentState {
	readonly opts: TimeFieldLiteralSegmentStateProps;
	readonly root: TimeFieldRootState;

	constructor(opts: TimeFieldLiteralSegmentStateProps, root: TimeFieldRootState) {
		this.opts = opts;
		this.root = root;
		this.onkeydown = this.onkeydown.bind(this);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.key !== kbd.TAB) e.preventDefault();
		if (this.root.opts.disabled.current) return;
		if (isSegmentNavigationKey(e.key)) {
			handleTimeSegmentNavigation(e, this.root.getFieldNode());
		}
	}

	props = $derived.by(
		() =>
			({
				role: "textbox",
				id: this.opts.id.current,
				"aria-label": "timezone, ",
				style: {
					caretColor: "transparent",
				},
				onkeydown: this.onkeydown,
				tabindex: 0,
				...this.root.getBaseSegmentAttrs("timeZoneName", this.opts.id.current),
				"data-readonly": getDataReadonly(true),
				...attachRef(this.opts.ref),
			}) as const
	);
}

// Utils/helpers
function isAcceptableDayPeriodKey(key: string) {
	return (
		isAcceptableSegmentKey(key) ||
		key === kbd.A ||
		key === kbd.P ||
		key === kbd.a ||
		key === kbd.p
	);
}

function isArrowUp(key: string) {
	return key === kbd.ARROW_UP;
}

function isArrowDown(key: string) {
	return key === kbd.ARROW_DOWN;
}

function isBackspace(key: string) {
	return key === kbd.BACKSPACE;
}

const TimeFieldRootContext = new Context<TimeFieldRootState>("TimeField.Root");

export function useTimeFieldRoot<T extends TimeValue = Time>(props: TimeFieldRootStateProps<T>) {
	return TimeFieldRootContext.set(new TimeFieldRootState(props) as unknown as TimeFieldRootState);
}

export function useTimeFieldInput(props: TimeFieldInputStateProps) {
	return new TimeFieldInputState(props, TimeFieldRootContext.get());
}

export function useTimeFieldHiddenInput() {
	return new TimeFieldHiddenInputState(TimeFieldRootContext.get());
}

export function useTimeFieldSegment(part: SegmentPart, props: WithRefProps) {
	return segmentPartToInstance({
		part,
		segmentProps: props,
		root: TimeFieldRootContext.get(),
	});
}

export function useTimeFieldLabel(props: TimeFieldLabelStateProps) {
	return new TimeFieldLabelState(props, TimeFieldRootContext.get());
}

type SegmentPartToInstanceProps = {
	part: SegmentPart;
	root: TimeFieldRootState;
	segmentProps: WithRefProps;
};

function segmentPartToInstance(props: SegmentPartToInstanceProps) {
	switch (props.part) {
		case "hour":
			return new TimeFieldHourSegmentState(props.segmentProps, props.root);
		case "minute":
			return new TimeFieldMinuteSegmentState(props.segmentProps, props.root);
		case "second":
			return new TimeFieldSecondSegmentState(props.segmentProps, props.root);
		case "dayPeriod":
			return new TimeFieldDayPeriodSegmentState(props.segmentProps, props.root);
		case "literal":
			return new TimeFieldLiteralSegmentState(props.segmentProps, props.root);
		case "timeZoneName":
			return new TimeFieldTimeZoneSegmentState(props.segmentProps, props.root);
		default:
			// For any date-related parts that shouldn't appear in time field
			throw new Error(`Invalid segment part for time field: ${props.part}`);
	}
}
