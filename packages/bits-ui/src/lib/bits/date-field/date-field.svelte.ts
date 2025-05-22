import type { Updater } from "svelte/store";
import type { DateValue } from "@internationalized/date";
import { type WritableBox, box, onDestroyEffect, useRefById } from "svelte-toolbelt";
import { onMount, untrack } from "svelte";
import { Context } from "runed";
import type { DateRangeFieldRootState } from "../date-range-field/date-range-field.svelte.js";
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
	DateAndTimeSegmentObj,
	DateOnInvalid,
	DateSegmentObj,
	DateSegmentPart,
	DateValidator,
	Granularity,
	HourCycle,
	SegmentPart,
	SegmentValueObj,
	TimeSegmentObj,
	TimeSegmentPart,
} from "$lib/shared/date/types.js";
import { type Formatter, createFormatter } from "$lib/internal/date-time/formatter.js";
import { type Announcer, getAnnouncer } from "$lib/internal/date-time/announcer.js";
import {
	areAllSegmentsFilled,
	createContent,
	getValueFromSegments,
	inferGranularity,
	initSegmentStates,
	initializeSegmentValues,
	isAcceptableSegmentKey,
	isDateAndTimeSegmentObj,
	isDateSegmentPart,
	isFirstSegment,
	removeDescriptionElement,
	setDescription,
} from "$lib/internal/date-time/field/helpers.js";
import { DATE_SEGMENT_PARTS, TIME_SEGMENT_PARTS } from "$lib/internal/date-time/field/parts.js";
import { getDaysInMonth, isBefore, toDate } from "$lib/internal/date-time/utils.js";
import {
	getFirstSegment,
	handleSegmentNavigation,
	isSegmentNavigationKey,
	moveToNextSegment,
	moveToPrevSegment,
} from "$lib/internal/date-time/field/segments.js";

export const DATE_FIELD_INPUT_ATTR = "data-date-field-input";
const DATE_FIELD_LABEL_ATTR = "data-date-field-label";

// Common segment configuration
type SegmentConfig = {
	min: number | ((root: DateFieldRootState) => number);
	max: number | ((root: DateFieldRootState) => number);
	cycle: number;
	canBeZero?: boolean;
	padZero?: boolean;
	getAnnouncement?: (value: number, root: DateFieldRootState) => string | number;
	updateLogic?: (props: {
		root: DateFieldRootState;
		prev: string | null;
		num: number;
		moveToNext: { value: boolean };
	}) => string | null;
};

const SEGMENT_CONFIGS: Record<
	"day" | "month" | "year" | "hour" | "minute" | "second",
	SegmentConfig
> = {
	day: {
		min: 1,
		max: (root) => {
			const segmentMonthValue = root.segmentValues.month;
			const placeholder = root.value.current ?? root.placeholder.current;
			return segmentMonthValue
				? getDaysInMonth(placeholder.set({ month: Number.parseInt(segmentMonthValue) }))
				: getDaysInMonth(placeholder);
		},
		cycle: 1,
		padZero: true,
	},
	month: {
		min: 1,
		max: 12,
		cycle: 1,
		padZero: true,
		getAnnouncement: (month, root) =>
			`${month} - ${root.formatter.fullMonth(toDate(root.placeholder.current.set({ month })))}`,
	},
	year: {
		min: 1,
		max: 9999,
		cycle: 1,
		padZero: false,
	},
	hour: {
		min: (root) => (root.hourCycle.current === 12 ? 1 : 0),
		max: (root) => {
			if (root.hourCycle.current === 24) return 23;
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

export type DateFieldRootStateProps = WritableBoxedValues<{
	value: DateValue | undefined;
	placeholder: DateValue;
}> &
	ReadableBoxedValues<{
		readonlySegments: SegmentPart[];
		validate: DateValidator | undefined;
		onInvalid: DateOnInvalid | undefined;
		minValue: DateValue | undefined;
		maxValue: DateValue | undefined;
		disabled: boolean;
		readonly: boolean;
		granularity: Granularity | undefined;
		hourCycle: HourCycle | undefined;
		locale: string;
		hideTimeZone: boolean;
		required: boolean;
		errorMessageId: string | undefined;
		isInvalidProp: boolean | undefined;
	}>;

export class DateFieldRootState {
	value: DateFieldRootStateProps["value"];
	placeholder: WritableBox<DateValue>;
	validate: DateFieldRootStateProps["validate"];
	minValue: DateFieldRootStateProps["minValue"];
	maxValue: DateFieldRootStateProps["maxValue"];
	disabled: DateFieldRootStateProps["disabled"];
	readonly: DateFieldRootStateProps["readonly"];
	granularity: DateFieldRootStateProps["granularity"];
	readonlySegments: DateFieldRootStateProps["readonlySegments"];
	hourCycle: DateFieldRootStateProps["hourCycle"];
	locale: DateFieldRootStateProps["locale"];
	hideTimeZone: DateFieldRootStateProps["hideTimeZone"];
	required: DateFieldRootStateProps["required"];
	onInvalid: DateFieldRootStateProps["onInvalid"];
	errorMessageId: DateFieldRootStateProps["errorMessageId"];
	isInvalidProp: DateFieldRootStateProps["isInvalidProp"];
	descriptionId = useId();
	formatter: Formatter;
	initialSegments: SegmentValueObj;
	segmentValues = $state() as SegmentValueObj;
	announcer: Announcer;
	readonlySegmentsSet = $derived.by(() => new Set(this.readonlySegments.current));
	segmentStates = initSegmentStates();
	#fieldNode = $state<HTMLElement | null>(null);
	#labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	validationNode = $state<HTMLElement | null>(null);
	states = initSegmentStates();
	dayPeriodNode = $state<HTMLElement | null>(null);
	rangeRoot: DateRangeFieldRootState | undefined = undefined;
	name = $state("");

	constructor(props: DateFieldRootStateProps, rangeRoot?: DateRangeFieldRootState) {
		this.rangeRoot = rangeRoot;
		/**
		 * Since the `DateFieldRootState` can be used in two contexts, as a standalone
		 * field or as a field within a `DateRangeField` component, we handle assigning
		 * the props based on that context.
		 */
		this.value = props.value;
		this.placeholder = rangeRoot ? rangeRoot.opts.placeholder : props.placeholder;
		this.validate = rangeRoot ? box(undefined) : props.validate;
		this.minValue = rangeRoot ? rangeRoot.opts.minValue : props.minValue;
		this.maxValue = rangeRoot ? rangeRoot.opts.maxValue : props.maxValue;
		this.disabled = rangeRoot ? rangeRoot.opts.disabled : props.disabled;
		this.readonly = rangeRoot ? rangeRoot.opts.readonly : props.readonly;
		this.granularity = rangeRoot ? rangeRoot.opts.granularity : props.granularity;
		this.readonlySegments = rangeRoot
			? rangeRoot.opts.readonlySegments
			: props.readonlySegments;
		this.hourCycle = rangeRoot ? rangeRoot.opts.hourCycle : props.hourCycle;
		this.locale = rangeRoot ? rangeRoot.opts.locale : props.locale;
		this.hideTimeZone = rangeRoot ? rangeRoot.opts.hideTimeZone : props.hideTimeZone;
		this.required = rangeRoot ? rangeRoot.opts.required : props.required;
		this.onInvalid = rangeRoot ? rangeRoot.opts.onInvalid : props.onInvalid;
		this.errorMessageId = rangeRoot ? rangeRoot.opts.errorMessageId : props.errorMessageId;
		this.isInvalidProp = props.isInvalidProp;
		this.formatter = createFormatter(this.locale.current);
		this.initialSegments = initializeSegmentValues(this.inferredGranularity);
		this.segmentValues = this.initialSegments;
		this.announcer = getAnnouncer();

		this.getFieldNode = this.getFieldNode.bind(this);
		this.updateSegment = this.updateSegment.bind(this);
		this.handleSegmentClick = this.handleSegmentClick.bind(this);
		this.getBaseSegmentAttrs = this.getBaseSegmentAttrs.bind(this);

		$effect(() => {
			untrack(() => {
				this.initialSegments = initializeSegmentValues(this.inferredGranularity);
			});
		});

		onMount(() => {
			this.announcer = getAnnouncer();
		});

		onDestroyEffect(() => {
			if (rangeRoot) return;
			removeDescriptionElement(this.descriptionId);
		});

		$effect(() => {
			if (rangeRoot) return;
			if (this.formatter.getLocale() === this.locale.current) return;
			this.formatter.setLocale(this.locale.current);
		});

		$effect(() => {
			if (rangeRoot) return;
			if (this.value.current) {
				const descriptionId = untrack(() => this.descriptionId);
				setDescription(descriptionId, this.formatter, this.value.current);
			}
			const placeholder = untrack(() => this.placeholder.current);
			if (this.value.current && placeholder !== this.value.current) {
				untrack(() => {
					if (this.value.current) {
						this.placeholder.current = this.value.current;
					}
				});
			}
		});

		if (this.value.current) {
			this.syncSegmentValues(this.value.current);
		}

		$effect(() => {
			this.locale.current;
			if (this.value.current) {
				this.syncSegmentValues(this.value.current);
			}

			this.#clearUpdating();
		});

		$effect(() => {
			if (this.value.current === undefined) {
				this.segmentValues = initializeSegmentValues(this.inferredGranularity);
			}
		});

		$effect(() => {
			this.validationStatus;
			untrack(() => {
				if (this.validationStatus !== false) {
					this.onInvalid.current?.(
						this.validationStatus.reason,
						this.validationStatus.message
					);
				}
			});
		});
	}

	setName(name: string) {
		this.name = name;
	}

	/**
	 * Sets the field node for the `DateFieldRootState` instance. We use this method so we can
	 * keep `#fieldNode` private to prevent accidental usage of the incorrect field node.
	 */
	setFieldNode(node: HTMLElement | null) {
		this.#fieldNode = node;
	}

	/**
	 * Gets the correct field node for the date field regardless of whether it's being
	 * used in a standalone context or within a `DateRangeField` component.
	 */
	getFieldNode() {
		/** If we're not within a DateRangeField, we return this field. */
		if (!this.rangeRoot) {
			return this.#fieldNode;
		} else {
			/**
			 * Otherwise, we return the rangeRoot's field node which
			 * contains both start and end fields.
			 */
			return this.rangeRoot.fieldNode;
		}
	}

	/**
	 * Sets the label node for the `DateFieldRootState` instance. We use this method so we can
	 * keep `#labelNode` private to prevent accidental usage of the incorrect label node.
	 */
	setLabelNode(node: HTMLElement | null) {
		this.#labelNode = node;
	}

	/**
	 * Gets the correct label node for the date field regardless of whether it's being used in
	 * a standalone context or within a `DateRangeField` component.
	 */
	getLabelNode() {
		/** If we're not within a DateRangeField, we return this field. */
		if (!this.rangeRoot) {
			return this.#labelNode;
		}
		/** Otherwise we return the rangeRoot's label node. */
		return this.rangeRoot.labelNode;
	}

	#clearUpdating() {
		this.states.day.updating = null;
		this.states.month.updating = null;
		this.states.year.updating = null;
		this.states.hour.updating = null;
		this.states.minute.updating = null;
		this.states.dayPeriod.updating = null;
	}

	setValue(value: DateValue | undefined) {
		this.value.current = value;
	}

	syncSegmentValues(value: DateValue) {
		const dateValues = DATE_SEGMENT_PARTS.map((part) => {
			const partValue = value[part];

			if (part === "month") {
				if (this.states.month.updating) {
					return [part, this.states.month.updating];
				}
				if (partValue < 10) {
					return [part, `0${partValue}`];
				}
			}

			if (part === "day") {
				if (this.states.day.updating) {
					return [part, this.states.day.updating];
				}

				if (partValue < 10) {
					return [part, `0${partValue}`];
				}
			}

			if (part === "year") {
				if (this.states.year.updating) {
					return [part, this.states.year.updating];
				}
				const valueDigits = `${partValue}`.length;
				const diff = 4 - valueDigits;
				if (diff > 0) {
					return [part, `${"0".repeat(diff)}${partValue}`];
				}
			}

			return [part, `${partValue}`];
		});
		if ("hour" in value) {
			const timeValues = TIME_SEGMENT_PARTS.map((part) => {
				if (part === "dayPeriod") {
					if (this.states.dayPeriod.updating) {
						return [part, this.states.dayPeriod.updating];
					} else {
						return [part, this.formatter.dayPeriod(toDate(value))];
					}
				} else if (part === "hour") {
					if (this.states.hour.updating) {
						return [part, this.states.hour.updating];
					}

					if (value[part] !== undefined && value[part] < 10) {
						return [part, `0${value[part]}`];
					}

					if (value[part] === 0) {
						/**
						 * If we're rendering a `dayPeriod` segment, we're operating in a
						 * 12-hour clock, so we never allow the displayed hour to be 0.
						 */
						if (this.dayPeriodNode) {
							return [part, "12"];
						}
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

			const mergedSegmentValues = [...dateValues, ...timeValues];
			this.segmentValues = Object.fromEntries(mergedSegmentValues);
			this.#clearUpdating();
			return;
		}

		this.segmentValues = Object.fromEntries(dateValues);
	}

	validationStatus = $derived.by(() => {
		const value = this.value.current;
		if (!value) return false as const;

		const msg = this.validate.current?.(value);

		if (msg) {
			return {
				reason: "custom",
				message: msg,
			} as const;
		}

		const minValue = this.minValue.current;
		if (minValue && isBefore(value, minValue)) {
			return {
				reason: "min",
			} as const;
		}
		const maxValue = this.maxValue.current;
		if (maxValue && isBefore(maxValue, value)) {
			return {
				reason: "max",
			} as const;
		}
		return false;
	});

	isInvalid = $derived.by(() => {
		if (this.validationStatus === false) return false;
		if (this.isInvalidProp.current) return true;
		return true;
	});

	inferredGranularity = $derived.by(() => {
		const granularity = this.granularity.current;
		if (granularity) return granularity;
		const inferred = inferGranularity(this.placeholder.current, this.granularity.current);
		return inferred;
	});

	dateRef = $derived.by(() => this.value.current ?? this.placeholder.current);

	allSegmentContent = $derived.by(() =>
		createContent({
			segmentValues: this.segmentValues,
			formatter: this.formatter,
			locale: this.locale.current,
			granularity: this.inferredGranularity,
			dateRef: this.dateRef,
			hideTimeZone: this.hideTimeZone.current,
			hourCycle: this.hourCycle.current,
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

	updateSegment<T extends keyof DateAndTimeSegmentObj>(
		part: T,
		cb: T extends DateSegmentPart
			? Updater<DateSegmentObj[T]>
			: T extends TimeSegmentPart
				? Updater<TimeSegmentObj[T]>
				: Updater<DateAndTimeSegmentObj[T]>
	) {
		const disabled = this.disabled.current;
		const readonly = this.readonly.current;
		const readonlySegmentsSet = this.readonlySegmentsSet;
		if (disabled || readonly || readonlySegmentsSet.has(part)) return;

		const prev = this.segmentValues;

		let newSegmentValues: SegmentValueObj = prev;

		const dateRef = this.placeholder.current;
		if (isDateAndTimeSegmentObj(prev)) {
			const pVal = prev[part];
			const castCb = cb as Updater<DateAndTimeSegmentObj[T]>;
			if (part === "month") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["month"];
				this.states.month.updating = next;
				if (next !== null && prev.day !== null) {
					const date = dateRef.set({ month: Number.parseInt(next) });
					const daysInMonth = getDaysInMonth(toDate(date));
					const prevDay = Number.parseInt(prev.day);
					if (prevDay > daysInMonth) {
						prev.day = `${daysInMonth}`;
					}
				}
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "dayPeriod") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["dayPeriod"];
				this.states.dayPeriod.updating = next;
				const date = this.value.current;
				if (date && "hour" in date) {
					const trueHour = date.hour;
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
				const next = castCb(pVal) as DateAndTimeSegmentObj["hour"];
				this.states.hour.updating = next;
				if (next !== null && prev.dayPeriod !== null) {
					const dayPeriod = this.formatter.dayPeriod(
						toDate(dateRef.set({ hour: Number.parseInt(next) })),
						this.hourCycle.current
					);
					if (dayPeriod === "AM" || dayPeriod === "PM") {
						prev.dayPeriod = dayPeriod;
					}
				}
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "minute") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["minute"];
				this.states.minute.updating = next;
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "second") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["second"];
				this.states.second.updating = next;
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "year") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["year"];
				this.states.year.updating = next;
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "day") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["day"];
				this.states.day.updating = next;
				newSegmentValues = { ...prev, [part]: next };
			} else {
				const next = castCb(pVal);
				newSegmentValues = { ...prev, [part]: next };
			}
		} else if (isDateSegmentPart(part)) {
			const pVal = prev[part];
			const castCb = cb as Updater<DateSegmentObj[DateSegmentPart]>;
			const next = castCb(pVal);
			if (part === "month" && next !== null && prev.day !== null) {
				this.states.month.updating = next;
				const date = dateRef.set({ month: Number.parseInt(next) });
				const daysInMonth = getDaysInMonth(toDate(date));
				if (Number.parseInt(prev.day) > daysInMonth) {
					prev.day = `${daysInMonth}`;
				}
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "year") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["year"];
				this.states.year.updating = next;
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "day") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["day"];
				this.states.day.updating = next;
				newSegmentValues = { ...prev, [part]: next };
			} else {
				newSegmentValues = { ...prev, [part]: next };
			}
		}
		this.segmentValues = newSegmentValues;
		if (areAllSegmentsFilled(newSegmentValues, this.#fieldNode)) {
			this.setValue(
				getValueFromSegments({
					segmentObj: newSegmentValues,
					fieldNode: this.#fieldNode,
					dateRef: this.placeholder.current,
				})
			);
		} else {
			this.setValue(undefined);
			this.segmentValues = newSegmentValues;
		}
	}

	handleSegmentClick(e: BitsMouseEvent) {
		if (this.disabled.current) {
			e.preventDefault();
		}
	}

	getBaseSegmentAttrs(part: SegmentPart, segmentId: string) {
		const inReadonlySegments = this.readonlySegmentsSet.has(part);
		const defaultAttrs = {
			"aria-invalid": getAriaInvalid(this.isInvalid),
			"aria-disabled": getAriaDisabled(this.disabled.current),
			"aria-readonly": getAriaReadonly(this.readonly.current || inReadonlySegments),
			"data-invalid": getDataInvalid(this.isInvalid),
			"data-disabled": getDataDisabled(this.disabled.current),
			"data-readonly": getDataReadonly(this.readonly.current || inReadonlySegments),
			"data-segment": `${part}`,
		};

		if (part === "literal") return defaultAttrs;

		const descriptionId = this.descriptionNode?.id;
		const hasDescription = isFirstSegment(segmentId, this.#fieldNode) && descriptionId;
		const errorMsgId = this.errorMessageId?.current;

		const describedBy = hasDescription
			? `${descriptionId} ${this.isInvalid && errorMsgId ? errorMsgId : ""}`
			: undefined;

		const contenteditable = !(
			this.readonly.current ||
			inReadonlySegments ||
			this.disabled.current
		);

		return {
			...defaultAttrs,
			"aria-labelledby": this.#getLabelledBy(segmentId),
			contenteditable: contenteditable ? "true" : undefined,
			"aria-describedby": describedBy,
			tabindex: this.disabled.current ? undefined : 0,
		};
	}
}

type DateFieldInputStateProps = WithRefProps &
	ReadableBoxedValues<{
		name: string;
	}>;

export class DateFieldInputState {
	readonly opts: DateFieldInputStateProps;
	readonly root: DateFieldRootState;

	constructor(opts: DateFieldInputStateProps, root: DateFieldRootState) {
		this.opts = opts;
		this.root = root;

		$effect(() => {
			this.root.setName(this.opts.name.current);
		});

		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.setFieldNode(node);
			},
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
				"aria-disabled": getAriaDisabled(this.root.disabled.current),
				"data-invalid": this.root.isInvalid ? "" : undefined,
				"data-disabled": getDataDisabled(this.root.disabled.current),
				[DATE_FIELD_INPUT_ATTR]: "",
			}) as const
	);
}
class DateFieldHiddenInputState {
	readonly root: DateFieldRootState;
	shouldRender = $derived.by(() => this.root.name !== "");
	isoValue = $derived.by(() =>
		this.root.value.current ? this.root.value.current.toString() : ""
	);

	constructor(root: DateFieldRootState) {
		this.root = root;
	}

	props = $derived.by(() => {
		return {
			name: this.root.name,
			value: this.isoValue,
			required: this.root.required.current,
		};
	});
}

type DateFieldLabelStateProps = WithRefProps;

class DateFieldLabelState {
	readonly opts: DateFieldLabelStateProps;
	readonly root: DateFieldRootState;

	constructor(opts: DateFieldLabelStateProps, root: DateFieldRootState) {
		this.opts = opts;
		this.root = root;
		this.onclick = this.onclick.bind(this);

		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.setLabelNode(node);
			},
		});
	}

	onclick(_: BitsMouseEvent) {
		if (this.root.disabled.current) return;
		const firstSegment = getFirstSegment(this.root.getFieldNode());
		if (!firstSegment) return;
		firstSegment.focus();
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-invalid": getDataInvalid(this.root.isInvalid),
				"data-disabled": getDataDisabled(this.root.disabled.current),
				[DATE_FIELD_LABEL_ATTR]: "",
				onclick: this.onclick,
			}) as const
	);
}

// Base class for numeric segments
abstract class BaseNumericSegmentState {
	readonly opts: WithRefProps;
	readonly root: DateFieldRootState;
	readonly announcer: Announcer;
	readonly part: string;
	readonly config: SegmentConfig;

	constructor(opts: WithRefProps, root: DateFieldRootState, part: string, config: SegmentConfig) {
		this.opts = opts;
		this.root = root;
		this.part = part;
		this.config = config;
		this.announcer = root.announcer;
		this.onkeydown = this.onkeydown.bind(this);
		this.onfocusout = this.onfocusout.bind(this);

		useRefById(opts);
	}

	#getMax(): number {
		return typeof this.config.max === "function" ? this.config.max(this.root) : this.config.max;
	}

	#getMin(): number {
		return typeof this.config.min === "function" ? this.config.min(this.root) : this.config.min;
	}

	#getAnnouncement(value: number): string | number {
		if (this.config.getAnnouncement) {
			return this.config.getAnnouncement(value, this.root);
		}
		return value;
	}

	#formatValue(value: number, forDisplay = true): string {
		const str = String(value);
		if (forDisplay && this.config.padZero && str.length === 1) {
			return `0${value}`;
		}
		return str;
	}

	onkeydown(e: BitsKeyboardEvent) {
		const placeholder = this.root.value.current ?? this.root.placeholder.current;
		if (e.ctrlKey || e.metaKey || this.root.disabled.current) return;

		// Special check for time segments
		if (
			(this.part === "hour" || this.part === "minute" || this.part === "second") &&
			!(this.part in placeholder)
		)
			return;

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
			handleSegmentNavigation(e, this.root.getFieldNode());
		}
	}

	#handleArrowUp(placeholder: DateValue) {
		const stateKey = this.part as keyof typeof this.root.states;
		if (stateKey in this.root.states) {
			this.root.states[stateKey].hasLeftFocus = false;
		}

		// @ts-expect-error this is a part
		this.root.updateSegment(this.part, (prev: string | null) => {
			if (prev === null) {
				const next = placeholder[this.part as keyof DateValue];
				this.announcer.announce(this.#getAnnouncement(next as number));
				return this.#formatValue(next as number);
			}
			const current = placeholder.set({
				[this.part]: Number.parseInt(prev),
			});
			// @ts-expect-error this is a part
			const next = current.cycle(this.part, this.config.cycle)[this.part as keyof DateValue];
			this.announcer.announce(this.#getAnnouncement(next as number));
			return this.#formatValue(next as number);
		});
	}

	#handleArrowDown(placeholder: DateValue) {
		const stateKey = this.part as keyof typeof this.root.states;
		if (stateKey in this.root.states) {
			this.root.states[stateKey].hasLeftFocus = false;
		}

		// @ts-expect-error this is a part
		this.root.updateSegment(this.part, (prev: string | null) => {
			if (prev === null) {
				const next = placeholder[this.part as keyof DateValue];
				this.announcer.announce(this.#getAnnouncement(next as number));
				return this.#formatValue(next as number);
			}
			const current = placeholder.set({
				[this.part]: Number.parseInt(prev),
			});
			// @ts-expect-error this is a part
			const next = current.cycle(this.part, -this.config.cycle)[this.part as keyof DateValue];
			this.announcer.announce(this.#getAnnouncement(next as number));
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
			// Check if user has left focus
			if (stateKey in this.root.states && this.root.states[stateKey].hasLeftFocus) {
				prev = null;
				this.root.states[stateKey].hasLeftFocus = false;
			}

			// Starting fresh
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

			// Handle special cases for segments with lastKeyZero tracking
			if (stateKey in this.root.states && this.root.states[stateKey].lastKeyZero) {
				if (num !== 0) {
					moveToNext = true;
					this.root.states[stateKey].lastKeyZero = false;
					return `0${num}`;
				}

				// Special handling for hour segment with 24-hour cycle
				if (this.part === "hour" && num === 0 && this.root.hourCycle.current === 24) {
					moveToNext = true;
					this.root.states[stateKey].lastKeyZero = false;
					return `00`;
				}

				// Special handling for minute/second segments
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
			moveToNextSegment(e, this.root.getFieldNode());
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
			this.announcer.announce(this.#getAnnouncement(next));
			return `${next}`;
		});

		if (moveToPrev) {
			moveToPrevSegment(e, this.root.getFieldNode());
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
		const placeholder = this.root.placeholder.current;
		const isEmpty = segmentValues[this.part as keyof SegmentValueObj] === null;

		let date = placeholder;
		if (segmentValues[this.part as keyof SegmentValueObj]) {
			date = placeholder.set({
				[this.part]: Number.parseInt(
					segmentValues[this.part as keyof SegmentValueObj] as string
				),
			});
		}

		const valueNow = date[this.part as keyof DateValue] as number;
		const valueMin = this.#getMin();
		const valueMax = this.#getMax();
		let valueText = isEmpty ? "Empty" : `${valueNow}`;

		// Special handling for hour segment with dayPeriod
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
		};
	});
}

// Year segment needs special handling
class DateFieldYearSegmentState extends BaseNumericSegmentState {
	#pressedKeys: string[] = [];
	#backspaceCount = 0;

	constructor(opts: WithRefProps, root: DateFieldRootState) {
		super(opts, root, "year", SEGMENT_CONFIGS.year);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.ctrlKey || e.metaKey || this.root.disabled.current) return;
		if (e.key !== kbd.TAB) e.preventDefault();
		if (!isAcceptableSegmentKey(e.key)) return;

		if (isArrowUp(e.key)) {
			this.#resetBackspaceCount();
			super.onkeydown(e);
			return;
		}

		if (isArrowDown(e.key)) {
			this.#resetBackspaceCount();
			super.onkeydown(e);
			return;
		}

		if (isNumberString(e.key)) {
			this.#handleYearNumberKey(e);
			return;
		}

		if (isBackspace(e.key)) {
			this.#handleYearBackspace(e);
			return;
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.root.getFieldNode());
		}
	}

	#resetBackspaceCount() {
		this.#backspaceCount = 0;
	}

	#incrementBackspaceCount() {
		this.#backspaceCount++;
	}

	#handleYearNumberKey(e: BitsKeyboardEvent) {
		this.#pressedKeys.push(e.key);
		let moveToNext = false;
		const num = Number.parseInt(e.key);

		this.root.updateSegment("year", (prev) => {
			if (this.root.states.year.hasLeftFocus) {
				prev = null;
				this.root.states.year.hasLeftFocus = false;
			}

			if (prev === null) {
				this.announcer.announce(num);
				return `000${num}`;
			}

			const str = prev.toString() + num.toString();
			const mergedInt = Number.parseInt(str);
			const mergedIntDigits = String(mergedInt).length;

			if (mergedIntDigits < 4) {
				if (
					this.#backspaceCount > 0 &&
					this.#pressedKeys.length <= this.#backspaceCount &&
					str.length <= 4
				) {
					this.announcer.announce(mergedInt);
					return str;
				}

				this.announcer.announce(mergedInt);
				return prependYearZeros(mergedInt);
			}

			this.announcer.announce(mergedInt);
			moveToNext = true;

			const mergedIntStr = `${mergedInt}`;

			if (mergedIntStr.length > 4) {
				return mergedIntStr.slice(0, 4);
			}

			return mergedIntStr;
		});

		if (this.#pressedKeys.length === 4 || this.#pressedKeys.length === this.#backspaceCount) {
			moveToNext = true;
		}

		if (moveToNext) {
			moveToNextSegment(e, this.root.getFieldNode());
		}
	}

	#handleYearBackspace(e: BitsKeyboardEvent) {
		this.#pressedKeys = [];
		this.#incrementBackspaceCount();
		let moveToPrev = false;

		this.root.updateSegment("year", (prev) => {
			this.root.states.year.hasLeftFocus = false;
			if (prev === null) {
				moveToPrev = true;
				this.announcer.announce(null);
				return null;
			}
			const str = prev.toString();
			if (str.length === 1) {
				this.announcer.announce(null);
				return null;
			}
			const next = str.slice(0, -1);
			this.announcer.announce(next);

			return `${next}`;
		});

		if (moveToPrev) {
			moveToPrevSegment(e, this.root.getFieldNode());
		}
	}

	onfocusout(_: BitsFocusEvent) {
		this.root.states.year.hasLeftFocus = true;
		this.#pressedKeys = [];
		this.#resetBackspaceCount();
		this.root.updateSegment("year", (prev) => {
			if (prev && prev.length !== 4) {
				return prependYearZeros(Number.parseInt(prev));
			}
			return prev;
		});
	}
}

// Create segment states using the base class
class DateFieldDaySegmentState extends BaseNumericSegmentState {
	constructor(opts: WithRefProps, root: DateFieldRootState) {
		super(opts, root, "day", SEGMENT_CONFIGS.day);
	}
}

class DateFieldMonthSegmentState extends BaseNumericSegmentState {
	constructor(opts: WithRefProps, root: DateFieldRootState) {
		super(opts, root, "month", SEGMENT_CONFIGS.month);
	}
}

class DateFieldHourSegmentState extends BaseNumericSegmentState {
	constructor(opts: WithRefProps, root: DateFieldRootState) {
		super(opts, root, "hour", SEGMENT_CONFIGS.hour);
	}

	// Override to handle special hour logic
	onkeydown(e: BitsKeyboardEvent) {
		// Add special handling for hour display with dayPeriod
		if (isNumberString(e.key)) {
			const oldUpdateSegment = this.root.updateSegment.bind(this.root);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			this.root.updateSegment = (part: any, cb: any) => {
				const result = oldUpdateSegment(part, cb);

				// After updating hour, check if we need to display "12" instead of "0"
				if (part === "hour" && "hour" in this.root.segmentValues) {
					const hourValue = this.root.segmentValues.hour;
					if (
						hourValue === "0" &&
						this.root.dayPeriodNode &&
						this.root.hourCycle.current !== 24
					) {
						this.root.segmentValues.hour = "12";
					}
				}

				return result;
			};
		}

		super.onkeydown(e);

		// Restore original updateSegment
		this.root.updateSegment = this.root.updateSegment.bind(this.root);
	}
}

class DateFieldMinuteSegmentState extends BaseNumericSegmentState {
	constructor(opts: WithRefProps, root: DateFieldRootState) {
		super(opts, root, "minute", SEGMENT_CONFIGS.minute);
	}
}

class DateFieldSecondSegmentState extends BaseNumericSegmentState {
	constructor(opts: WithRefProps, root: DateFieldRootState) {
		super(opts, root, "second", SEGMENT_CONFIGS.second);
	}
}

// Special segments that don't extend the base class
type DateFieldDayPeriodSegmentStateProps = WithRefProps;

class DateFieldDayPeriodSegmentState {
	readonly opts: DateFieldDayPeriodSegmentStateProps;
	readonly root: DateFieldRootState;
	#announcer: Announcer;

	constructor(opts: DateFieldDayPeriodSegmentStateProps, root: DateFieldRootState) {
		this.opts = opts;
		this.root = root;
		this.#announcer = this.root.announcer;
		this.onkeydown = this.onkeydown.bind(this);

		useRefById({
			...opts,
			onRefChange: (node) => {
				this.root.dayPeriodNode = node;
			},
		});
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.ctrlKey || e.metaKey || this.root.disabled.current) return;

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
			handleSegmentNavigation(e, this.root.getFieldNode());
		}
	}

	props = $derived.by(() => {
		const segmentValues = this.root.segmentValues;
		if (!("dayPeriod" in segmentValues)) return;

		const valueMin = 0;
		const valueMax = 12;
		const valueNow = segmentValues.dayPeriod ?? 0;
		const valueText = segmentValues.dayPeriod ?? "AM";

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
		};
	});
}

type DateFieldLiteralSegmentStateProps = WithRefProps;

class DateFieldDayLiteralSegmentState {
	readonly opts: DateFieldLiteralSegmentStateProps;
	readonly root: DateFieldRootState;

	constructor(opts: DateFieldLiteralSegmentStateProps, root: DateFieldRootState) {
		this.opts = opts;
		this.root = root;

		useRefById(opts);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-hidden": getAriaHidden(true),
				...this.root.getBaseSegmentAttrs("literal", this.opts.id.current),
			}) as const
	);
}

class DateFieldTimeZoneSegmentState {
	readonly opts: DateFieldLiteralSegmentStateProps;
	readonly root: DateFieldRootState;

	constructor(opts: DateFieldLiteralSegmentStateProps, root: DateFieldRootState) {
		this.opts = opts;
		this.root = root;
		this.onkeydown = this.onkeydown.bind(this);

		useRefById(opts);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (e.key !== kbd.TAB) e.preventDefault();
		if (this.root.disabled.current) return;
		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.root.getFieldNode());
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

const DateFieldRootContext = new Context<DateFieldRootState>("DateField.Root");

export function useDateFieldRoot(
	props: DateFieldRootStateProps,
	rangeRoot?: DateRangeFieldRootState
) {
	return DateFieldRootContext.set(new DateFieldRootState(props, rangeRoot));
}

export function useDateFieldInput(props: DateFieldInputStateProps) {
	return new DateFieldInputState(props, DateFieldRootContext.get());
}

export function useDateFieldHiddenInput() {
	return new DateFieldHiddenInputState(DateFieldRootContext.get());
}

export function useDateFieldSegment(part: SegmentPart, props: WithRefProps) {
	return segmentPartToInstance({
		part,
		segmentProps: props,
		root: DateFieldRootContext.get(),
	});
}

export function useDateFieldLabel(props: DateFieldLabelStateProps) {
	return new DateFieldLabelState(props, DateFieldRootContext.get());
}

type SegmentPartToInstanceProps = {
	part: SegmentPart;
	root: DateFieldRootState;
	segmentProps: WithRefProps;
};

function segmentPartToInstance(props: SegmentPartToInstanceProps) {
	switch (props.part) {
		case "day":
			return new DateFieldDaySegmentState(props.segmentProps, props.root);
		case "month":
			return new DateFieldMonthSegmentState(props.segmentProps, props.root);
		case "year":
			return new DateFieldYearSegmentState(props.segmentProps, props.root);
		case "hour":
			return new DateFieldHourSegmentState(props.segmentProps, props.root);
		case "minute":
			return new DateFieldMinuteSegmentState(props.segmentProps, props.root);
		case "second":
			return new DateFieldSecondSegmentState(props.segmentProps, props.root);
		case "dayPeriod":
			return new DateFieldDayPeriodSegmentState(props.segmentProps, props.root);
		case "literal":
			return new DateFieldDayLiteralSegmentState(props.segmentProps, props.root);
		case "timeZoneName":
			return new DateFieldTimeZoneSegmentState(props.segmentProps, props.root);
	}
}

function prependYearZeros(year: number) {
	const digits = String(year).length;
	const diff = 4 - digits;
	return `${"0".repeat(diff)}${year}`;
}
