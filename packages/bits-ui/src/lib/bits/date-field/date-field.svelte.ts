import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { getAnnouncer, type Announcer } from "$lib/shared/date/announcer.js";
import {
	areAllSegmentsFilled,
	createContent,
	getValueFromSegments,
	inferGranularity,
	initializeSegmentValues,
	initSegmentStates,
	isAcceptableSegmentKey,
	isDateAndTimeSegmentObj,
	isDateSegmentPart,
	isFirstSegment,
	removeDescriptionElement,
	setDescription,
} from "$lib/shared/date/field/helpers.js";
import {
	type DateAndTimeSegmentObj,
	type DateSegmentObj,
	type DateSegmentPart,
	type SegmentValueObj,
	type TimeSegmentObj,
	type TimeSegmentPart,
} from "$lib/shared/date/field/types.js";
import { createFormatter, type Formatter } from "$lib/shared/date/formatter.js";
import { getDaysInMonth, isBefore, toDate } from "$lib/shared/date/utils.js";
import type { Updater } from "svelte/store";
import type { DateValue } from "@internationalized/date";
import type { WritableBox } from "svelte-toolbelt";
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
import {
	getFirstSegment,
	handleSegmentNavigation,
	isSegmentNavigationKey,
	moveToNextSegment,
	moveToPrevSegment,
} from "$lib/shared/date/field.js";
import type { SegmentPart } from "$lib/shared/index.js";
import { DATE_SEGMENT_PARTS, TIME_SEGMENT_PARTS } from "$lib/shared/date/field/parts.js";
import { onDestroy, onMount, untrack } from "svelte";
import { createContext } from "$lib/internal/createContext.js";
import { useId } from "$lib/internal/useId.svelte.js";
import type { Granularity, Matcher } from "$lib/shared/date/types.js";
import type { DateRangeFieldRootState } from "../date-range-field/date-range-field.svelte.js";

type DateFieldRootStateProps = WritableBoxedValues<{
	value: DateValue | undefined;
	placeholder: DateValue;
}> &
	ReadableBoxedValues<{
		readonlySegments: SegmentPart[];
		isDateUnavailable: Matcher | undefined;
		minValue: DateValue | undefined;
		maxValue: DateValue | undefined;
		disabled: boolean;
		readonly: boolean;
		granularity: Granularity | undefined;
		hourCycle: 12 | 24 | undefined;
		locale: string;
		hideTimeZone: boolean;
		name: string;
		required: boolean;
	}>;

class DateFieldRootState {
	value: DateFieldRootStateProps["value"];
	placeholder: WritableBox<DateValue>;
	isDateUnavailable: DateFieldRootStateProps["isDateUnavailable"];
	minValue: DateFieldRootStateProps["minValue"];
	maxValue: DateFieldRootStateProps["maxValue"];
	disabled: DateFieldRootStateProps["disabled"];
	readonly: DateFieldRootStateProps["readonly"];
	granularity: DateFieldRootStateProps["granularity"];
	readonlySegments: DateFieldRootStateProps["readonlySegments"];
	hourCycle: DateFieldRootStateProps["hourCycle"];
	locale: DateFieldRootStateProps["locale"];
	hideTimeZone: DateFieldRootStateProps["hideTimeZone"];
	name: DateFieldRootStateProps["name"];
	required: DateFieldRootStateProps["required"];
	descriptionId = useId();
	formatter: Formatter;
	initialSegments: SegmentValueObj;
	segmentValues = $state() as SegmentValueObj;
	announcer: Announcer;
	readonlySegmentsSet = $derived.by(() => new Set(this.readonlySegments.value));
	segmentStates = initSegmentStates();
	#fieldNode = $state<HTMLElement | null>(null);
	#labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	validationNode = $state<HTMLElement | null>(null);
	states = initSegmentStates();
	dayPeriodNode = $state<HTMLElement | null>(null);
	rangeRoot: DateRangeFieldRootState | undefined = undefined;

	constructor(props: DateFieldRootStateProps, rangeRoot?: DateRangeFieldRootState) {
		this.rangeRoot = rangeRoot;
		/**
		 * Since the `DateFieldRootState` can be used in two contexts, as a standalone
		 * field or as a field within a `DateRangeField` component, we handle assigning
		 * the props based on that context.
		 */
		this.value = props.value;
		this.placeholder = rangeRoot ? rangeRoot.placeholder : props.placeholder;
		this.isDateUnavailable = rangeRoot ? rangeRoot.isDateUnavailable : props.isDateUnavailable;
		this.minValue = rangeRoot ? rangeRoot.minValue : props.minValue;
		this.maxValue = rangeRoot ? rangeRoot.maxValue : props.maxValue;
		this.disabled = rangeRoot ? rangeRoot.disabled : props.disabled;
		this.readonly = rangeRoot ? rangeRoot.readonly : props.readonly;
		this.granularity = rangeRoot ? rangeRoot.granularity : props.granularity;
		this.readonlySegments = rangeRoot ? rangeRoot.readonlySegments : props.readonlySegments;
		this.hourCycle = rangeRoot ? rangeRoot.hourCycle : props.hourCycle;
		this.locale = rangeRoot ? rangeRoot.locale : props.locale;
		this.hideTimeZone = rangeRoot ? rangeRoot.hideTimeZone : props.hideTimeZone;
		this.required = rangeRoot ? rangeRoot.required : props.required;
		this.name = props.name;
		this.formatter = createFormatter(this.locale.value);
		this.initialSegments = initializeSegmentValues(this.inferredGranularity);
		this.segmentValues = this.initialSegments;
		this.announcer = getAnnouncer();

		$effect(() => {
			untrack(() => {
				this.initialSegments = initializeSegmentValues(this.inferredGranularity);
			});
		});

		onMount(() => {
			this.announcer = getAnnouncer();
		});

		onDestroy(() => {
			if (rangeRoot) return;
			removeDescriptionElement(this.descriptionId);
		});

		$effect(() => {
			if (rangeRoot) return;
			if (this.formatter.getLocale() === this.locale.value) return;
			this.formatter.setLocale(this.locale.value);
		});

		$effect(() => {
			if (rangeRoot) return;
			if (this.value.value) {
				const descriptionId = untrack(() => this.descriptionId);
				setDescription(descriptionId, this.formatter, this.value.value);
			}
			const placeholder = untrack(() => this.placeholder.value);
			if (this.value.value && placeholder !== this.value.value) {
				untrack(() => {
					if (this.value.value) {
						this.placeholder.value = this.value.value;
					}
				});
			}
		});

		if (this.value.value) {
			this.syncSegmentValues(this.value.value);
		}

		$effect(() => {
			this.locale.value;
			if (this.value.value) {
				this.syncSegmentValues(this.value.value);
			}

			this.clearUpdating();
		});
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

	clearUpdating() {
		this.states.day.updating = null;
		this.states.month.updating = null;
		this.states.year.updating = null;
		this.states.hour.updating = null;
		this.states.minute.updating = null;
		this.states.dayPeriod.updating = null;
	}

	setValue(value: DateValue | undefined) {
		this.value.value = value;
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
			this.clearUpdating();
			return;
		}

		this.segmentValues = Object.fromEntries(dateValues);
	}

	isInvalid = $derived.by(() => {
		const value = this.value.value;
		if (!value) return false;
		if (this.isDateUnavailable.value?.(value)) return true;
		const minValue = this.minValue.value;
		if (minValue && isBefore(value, minValue)) return true;
		const maxValue = this.maxValue.value;
		if (maxValue && isBefore(maxValue, value)) return true;
		return false;
	});

	inferredGranularity = $derived.by(() => {
		const granularity = this.granularity.value;
		if (granularity) return granularity;
		const inferred = inferGranularity(this.placeholder.value, this.granularity.value);
		return inferred;
	});

	allSegmentContent = $derived.by(() =>
		createContent({
			segmentValues: this.segmentValues,
			formatter: this.formatter,
			locale: this.locale.value,
			granularity: this.inferredGranularity,
			dateRef: this.placeholder.value,
			hideTimeZone: this.hideTimeZone.value,
			hourCycle: this.hourCycle.value,
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

	getLabelledBy = (segmentId: string) => {
		return `${segmentId} ${this.getLabelNode()?.id ?? ""}`;
	};

	updateSegment = <T extends keyof DateAndTimeSegmentObj>(
		part: T,
		cb: T extends DateSegmentPart
			? Updater<DateSegmentObj[T]>
			: T extends TimeSegmentPart
				? Updater<TimeSegmentObj[T]>
				: Updater<DateAndTimeSegmentObj[T]>
	) => {
		const disabled = this.disabled.value;
		const readonly = this.readonly.value;
		const readonlySegmentsSet = this.readonlySegmentsSet;
		if (disabled || readonly || readonlySegmentsSet.has(part)) return;

		const prev = this.segmentValues;

		let newSegmentValues: SegmentValueObj = prev;

		const dateRef = this.placeholder.value;
		if (isDateAndTimeSegmentObj(prev)) {
			const pVal = prev[part];
			const castCb = cb as Updater<DateAndTimeSegmentObj[T]>;
			if (part === "month") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["month"];
				this.states.month.updating = next;
				if (next !== null && prev.day !== null) {
					const date = dateRef.set({ month: parseInt(next) });
					const daysInMonth = getDaysInMonth(toDate(date));
					const prevDay = parseInt(prev.day);
					if (prevDay > daysInMonth) {
						prev.day = `${daysInMonth}`;
					}
				}
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "dayPeriod") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["dayPeriod"];
				this.states.dayPeriod.updating = next;
				const date = this.value.value;
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
						toDate(dateRef.set({ hour: parseInt(next) }))
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
				const date = dateRef.set({ month: parseInt(next) });
				const daysInMonth = getDaysInMonth(toDate(date));
				if (parseInt(prev.day) > daysInMonth) {
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
					dateRef: this.placeholder.value,
				})
			);
		} else {
			this.setValue(undefined);
			this.segmentValues = newSegmentValues;
		}
	};

	handleSegmentClick = (e: MouseEvent) => {
		if (this.disabled.value) {
			e.preventDefault();
			return;
		}
	};

	getBaseSegmentAttrs = (part: SegmentPart, segmentId: string) => {
		const inReadonlySegments = this.readonlySegmentsSet.has(part);
		const defaultAttrs = {
			"aria-invalid": getAriaInvalid(this.isInvalid),
			"aria-disabled": getAriaDisabled(this.disabled.value),
			"aria-readonly": getAriaReadonly(this.readonly.value || inReadonlySegments),
			"data-invalid": getDataInvalid(this.isInvalid),
			"data-disabled": getDataDisabled(this.disabled.value),
			"data-segment": `${part}`,
		};

		if (part === "literal") return defaultAttrs;

		const descriptionId = this.descriptionNode?.id;
		const hasDescription = isFirstSegment(segmentId, this.#fieldNode) && descriptionId;
		const validationId = this.validationNode?.id;

		const describedBy = hasDescription
			? `${descriptionId} ${this.isInvalid && validationId ? validationId : ""}`
			: undefined;

		const contenteditable =
			this.readonly.value || inReadonlySegments || this.disabled.value ? false : true;

		return {
			...defaultAttrs,
			"aria-labelledby": this.getLabelledBy(segmentId),
			contenteditable: contenteditable ? "true" : undefined,
			"aria-describedby": describedBy,
			tabindex: this.disabled.value ? undefined : 0,
		};
	};

	createInput(props: DateFieldInputStateProps) {
		return new DateFieldInputState(props, this);
	}

	createLabel(props: DateFieldLabelStateProps) {
		return new DateFieldLabelState(props, this);
	}

	createHiddenInput() {
		return new DateFieldHiddenInputState(this);
	}

	createSegment(part: SegmentPart, props: WithRefProps) {
		return segmentPartToInstance({
			part,
			segmentProps: props,
			root: this,
		});
	}
}

type DateFieldInputStateProps = WithRefProps;

class DateFieldInputState {
	#id: DateFieldInputStateProps["id"];
	#ref: DateFieldInputStateProps["ref"];
	root: DateFieldRootState;

	constructor(props: DateFieldInputStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
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
				id: this.#id.value,
				role: "group",
				"aria-labelledby": this.root.getLabelNode()?.id ?? undefined,
				"aria-describedby": this.#ariaDescribedBy,
				"aria-disabled": getAriaDisabled(this.root.disabled.value),
				"data-invalid": this.root.isInvalid ? "" : undefined,
				"data-disabled": getDataDisabled(this.root.disabled.value),
			}) as const
	);
}

class DateFieldHiddenInputState {
	#root: DateFieldRootState;
	shouldRender = $derived.by(() => this.#root.name.value !== "");
	isoValue = $derived.by(() => (this.#root.value.value ? this.#root.value.value.toString() : ""));

	constructor(root: DateFieldRootState) {
		this.#root = root;
	}

	props = $derived.by(() => {
		return {
			name: this.#root.name.value,
			value: this.isoValue,
			required: this.#root.required.value,
		};
	});
}

type DateFieldLabelStateProps = WithRefProps;

class DateFieldLabelState {
	#id: DateFieldLabelStateProps["id"];
	#ref: DateFieldLabelStateProps["ref"];
	#root: DateFieldRootState;

	constructor(props: DateFieldLabelStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.setLabelNode(node);
			},
		});
	}

	#onclick = () => {
		if (this.#root.disabled.value) return;
		const firstSegment = getFirstSegment(this.#root.getFieldNode());
		if (!firstSegment) return;
		firstSegment.focus();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				"data-invalid": getDataInvalid(this.#root.isInvalid),
				"data-disabled": getDataDisabled(this.#root.disabled.value),
				onclick: this.#onclick,
			}) as const
	);
}

type DateFieldDaySegmentStateProps = WithRefProps;

class DateFieldDaySegmentState {
	#id: DateFieldDaySegmentStateProps["id"];
	#ref: DateFieldDaySegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldDaySegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;
		this.#announcer = this.#root.announcer;
		this.#updateSegment = this.#root.updateSegment;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		const placeholder = this.#root.placeholder.value;
		if (e.ctrlKey || e.metaKey || this.#root.disabled.value) return;
		if (e.key !== kbd.TAB) e.preventDefault();
		if (!isAcceptableSegmentKey(e.key)) return;

		const segmentMonthValue = this.#root.segmentValues.month;

		const daysInMonth = segmentMonthValue
			? getDaysInMonth(placeholder.set({ month: parseInt(segmentMonthValue) }))
			: getDaysInMonth(placeholder);

		if (isArrowUp(e.key)) {
			this.#updateSegment("day", (prev) => {
				if (prev === null) {
					const next = placeholder.day;
					this.#announcer.announce(next);
					return `${next}`;
				}
				const next = placeholder.set({ day: parseInt(prev) }).cycle("day", 1).day;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}
		if (isArrowDown(e.key)) {
			this.#updateSegment("day", (prev) => {
				if (prev === null) {
					const next = placeholder.day;
					this.#announcer.announce(next);
					return `${next}`;
				}
				const next = placeholder.set({ day: parseInt(prev) }).cycle("day", -1).day;

				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		const fieldNode = this.#root.getFieldNode();

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			this.#updateSegment("day", (prev) => {
				const max = daysInMonth;
				const maxStart = Math.floor(max / 10);
				const numIsZero = num === 0;

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (this.#root.states.day.hasLeftFocus) {
					prev = null;
					this.#root.states.day.hasLeftFocus = false;
				}

				/**
				 * We are starting over in the segment if prev is null, which could
				 * happen in one of two scenarios:
				 * - the user has left the segment and then comes back to it
				 * - the segment was empty and the user begins typing a number
				 */
				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (numIsZero) {
						this.#root.states.day.lastKeyZero = true;
						this.#announcer.announce("0");
						return "0";
					}

					///////////////////////////

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (0-3 in most cases), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (this.#root.states.day.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}

					this.#root.states.day.lastKeyZero = false;

					/**
					 * If we're moving to the next segment and the number is less than
					 * two digits, we want to announce the number and return it with a
					 * leading zero to follow the placeholder format of `MM/DD/YYYY`.
					 */
					if (moveToNext && String(num).length === 1) {
						this.#announcer.announce(num);
						return `0${num}`;
					}

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return `${num}`;
				}

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * month, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				const total = parseInt(prev + num.toString());

				if (this.#root.states.day.lastKeyZero) {
					/**
					 * If the new number is not 0, then we reset the lastKeyZero state and
					 * move to the next segment, returning the new number with a leading 0.
					 */
					if (num !== 0) {
						moveToNext = true;
						this.#root.states.day.lastKeyZero = false;
						return `0${num}`;
					}

					/**
					 * If the new number is 0, then we simply return the previous value, since
					 * they didn't actually type a new number.
					 */
					return prev;
				}

				/**
				 * If the total is greater than the max day value possible for this month, then
				 * we want to move to the next segment, trimming the first digit from the total,
				 * replacing it with a 0.
				 */
				if (total > max) {
					moveToNext = true;
					return `0${num}`;
				}

				/**
				 * If the total has two digits and is less than or equal to the max day value,
				 * we will move to the next segment and return the total as the segment value.
				 */
				moveToNext = true;
				return `${total}`;
			});

			if (moveToNext) {
				moveToNextSegment(e, fieldNode);
			}
		}

		if (isBackspace(e.key)) {
			let moveToPrev = false;
			this.#updateSegment("day", (prev) => {
				this.#root.states.day.hasLeftFocus = false;
				if (prev === null) {
					moveToPrev = true;
					return null;
				}
				if (prev.length === 2 && prev.startsWith("0")) {
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) return null;
				return str.slice(0, -1);
			});

			if (moveToPrev) {
				moveToPrevSegment(e, fieldNode);
			}
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, fieldNode);
		}
	};

	#onfocusout = () => {
		this.#root.states.day.hasLeftFocus = true;
		this.#updateSegment("month", (prev) => {
			if (prev && prev.length === 1) {
				return `0${prev}`;
			}
			return prev;
		});
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		const isEmpty = segmentValues.day === null;
		const placeholder = this.#root.placeholder.value;
		const date = segmentValues.day
			? placeholder.set({ day: parseInt(segmentValues.day) })
			: placeholder;

		const valueNow = date.day;
		const valueMin = 1;
		const valueMax = getDaysInMonth(toDate(date));
		const valueText = isEmpty ? "Empty" : `${valueNow}`;

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			"aria-label": "day,",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onfocusout: this.#onfocusout,
			onclick: this.#root.handleSegmentClick,
			...this.#root.getBaseSegmentAttrs("day", this.#id.value),
		};
	});
}

type DateFieldMonthSegmentStateProps = WithRefProps;

class DateFieldMonthSegmentState {
	#id: DateFieldMonthSegmentStateProps["id"];
	#ref: DateFieldMonthSegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldMonthSegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;
		this.#announcer = this.#root.announcer;
		this.#updateSegment = this.#root.updateSegment;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	getAnnouncement = (month: number) => {
		return `${month} - ${this.#root.formatter.fullMonth(toDate(this.#root.placeholder.value.set({ month })))}`;
	};

	#onkeydown = (e: KeyboardEvent) => {
		const placeholder = this.#root.placeholder.value;
		if (e.ctrlKey || e.metaKey || this.#root.disabled.value) return;
		if (e.key !== kbd.TAB) e.preventDefault();
		if (!isAcceptableSegmentKey(e.key)) return;

		const max = 12;

		if (isArrowUp(e.key)) {
			this.#updateSegment("month", (prev) => {
				if (prev === null) {
					const next = placeholder.month;
					this.#announcer.announce(this.getAnnouncement(next));

					if (String(next).length === 1) {
						return `0${next}`;
					}

					return `${next}`;
				}
				const next = placeholder.set({ month: parseInt(prev) }).cycle("month", 1).month;
				this.#announcer.announce(this.getAnnouncement(next));
				if (String(next).length === 1) {
					return `0${next}`;
				}
				return `${next}`;
			});
			return;
		}

		if (isArrowDown(e.key)) {
			this.#updateSegment("month", (prev) => {
				if (prev === null) {
					const next = placeholder.month;
					this.#announcer.announce(this.getAnnouncement(next));
					if (String(next).length === 1) {
						return `0${next}`;
					}
					return `${next}`;
				}
				const next = placeholder.set({ month: parseInt(prev) }).cycle("month", -1).month;
				this.#announcer.announce(this.getAnnouncement(next));
				if (String(next).length === 1) {
					return `0${next}`;
				}
				return `${next}`;
			});
			return;
		}

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;

			this.#updateSegment("month", (prev) => {
				const maxStart = Math.floor(max / 10);
				const numIsZero = num === 0;

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (this.#root.states.month.hasLeftFocus) {
					prev = null;
					this.#root.states.month.hasLeftFocus = false;
				}

				/**
				 * We are starting over in the segment if prev is null, which could
				 * happen in one of two scenarios:
				 * - the user has left the segment and then comes back to it
				 * - the segment was empty and the user begins typing a number
				 */
				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (numIsZero) {
						this.#root.states.month.lastKeyZero = true;
						this.#announcer.announce("0");
						return "0";
					}

					///////////////////////////

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (0-3 in most cases), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (this.#root.states.month.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}

					this.#root.states.month.lastKeyZero = false;

					/**
					 * If we're moving to the next segment and the number is less than
					 * two digits, we want to announce the number and return it with a
					 * leading zero to follow the placeholder format of `MM/DD/YYYY`.
					 */
					if (moveToNext && String(num).length === 1) {
						this.#announcer.announce(num);
						return `0${num}`;
					}

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return `${num}`;
				}

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * month, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				const total = parseInt(prev + num.toString());

				if (this.#root.states.month.lastKeyZero) {
					/**
					 * If the new number is not 0, then we reset the lastKeyZero state and
					 * move to the next segment, returning the new number with a leading 0.
					 */
					if (num !== 0) {
						moveToNext = true;
						this.#root.states.month.lastKeyZero = false;
						return `0${num}`;
					}

					/**
					 * If the new number is 0, then we simply return the previous value, since
					 * they didn't actually type a new number.
					 */
					return prev;
				}

				/**
				 * If the total is greater than the max day value possible for this month, then
				 * we want to move to the next segment, trimming the first digit from the total,
				 * replacing it with a 0.
				 */
				if (total > max) {
					moveToNext = true;
					return `0${num}`;
				}

				/**
				 * If the total has two digits and is less than or equal to the max day value,
				 * we will move to the next segment and return the total as the segment value.
				 */
				moveToNext = true;
				return `${total}`;
			});

			if (moveToNext) {
				moveToNextSegment(e, this.#root.getFieldNode());
			}
		}

		if (isBackspace(e.key)) {
			this.#root.states.month.hasLeftFocus = false;
			let moveToPrev = false;
			this.#updateSegment("month", (prev) => {
				if (prev === null) {
					this.#announcer.announce(null);
					moveToPrev = true;
					return null;
				}

				if (prev.length === 2 && prev.startsWith("0")) {
					this.#announcer.announce(null);
					return null;
				}

				const str = prev.toString();
				if (str.length === 1) {
					this.#announcer.announce(null);
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				this.#announcer.announce(this.getAnnouncement(next));
				return `${next}`;
			});

			if (moveToPrev) {
				moveToPrevSegment(e, this.#root.getFieldNode());
			}
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.getFieldNode());
		}
	};

	#onfocusout = () => {
		this.#root.states.month.hasLeftFocus = true;
		this.#updateSegment("month", (prev) => {
			if (prev && prev.length === 1) {
				return `0${prev}`;
			}
			return prev;
		});
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		const placeholder = this.#root.placeholder.value;
		const isEmpty = segmentValues.month === null;
		const date = segmentValues.month
			? placeholder.set({ month: parseInt(segmentValues.month) })
			: placeholder;
		const valueNow = date.month;
		const valueMin = 1;
		const valueMax = 12;
		const valueText = isEmpty
			? "Empty"
			: `${valueNow} - ${this.#root.formatter.fullMonth(toDate(date))}`;

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			"aria-label": "month, ",
			contenteditable: "true",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onfocusout: this.#onfocusout,
			onclick: this.#root.handleSegmentClick,
			...this.#root.getBaseSegmentAttrs("month", this.#id.value),
		} as const;
	});
}

type DateFieldYearSegmentStateProps = WithRefProps;

class DateFieldYearSegmentState {
	#id: DateFieldYearSegmentStateProps["id"];
	#ref: DateFieldYearSegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	/**
	 * When typing a year, a user may want to type `0090` to represent `90`.
	 * So we track the keys they've pressed in this specific interaction to
	 * determine once they've pressed four to move to the next segment.
	 *
	 * On `focusout` this is reset to an empty array.
	 */
	#pressedKeys: string[] = [];

	/**
	 * When a user re-enters a completed segment and backspaces, if they have
	 * leading zeroes on the year, they won't automatically be sent to the next
	 * segment even if they complete all 4 digits. This is because the leading zeroes
	 * get stripped out for the digit count.
	 *
	 * This lets us keep track of how many times the user has backspaced in a row
	 * to determine how many additional key presses should move them to the next segment.
	 *
	 * For example, if the user has `0098` in the year segment and backspaces once,
	 * the segment will contain `009` and if the user types `7`, the segment should
	 * contain `0097` and move to the next segment.
	 *
	 * If the segment contains `0100` and the user backspaces twice, the segment will
	 * contain `01` and if the user types `2`, the segment should contain `012` and
	 * it should _not_ move to the next segment until the user types another digit.
	 */
	#backspaceCount = 0;

	constructor(props: DateFieldYearSegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;
		this.#announcer = this.#root.announcer;
		this.#updateSegment = this.#root.updateSegment;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#resetBackspaceCount() {
		this.#backspaceCount = 0;
	}

	#incrementBackspaceCount() {
		this.#backspaceCount++;
	}

	#onkeydown = (e: KeyboardEvent) => {
		const placeholder = this.#root.placeholder.value;
		if (e.ctrlKey || e.metaKey || this.#root.disabled.value) return;
		if (e.key !== kbd.TAB) e.preventDefault();
		if (!isAcceptableSegmentKey(e.key)) return;

		if (isArrowUp(e.key)) {
			this.#resetBackspaceCount();
			this.#updateSegment("year", (prev) => {
				if (prev === null) {
					const next = placeholder.year;
					this.#announcer.announce(next);
					return `${next}`;
				}
				const next = placeholder.set({ year: parseInt(prev) }).cycle("year", 1).year;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}
		if (isArrowDown(e.key)) {
			this.#resetBackspaceCount();
			this.#updateSegment("year", (prev) => {
				if (prev === null) {
					const next = placeholder.year;
					this.#announcer.announce(next);
					return `${next}`;
				}
				const next = placeholder.set({ year: parseInt(prev) }).cycle("year", -1).year;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isNumberString(e.key)) {
			this.#pressedKeys.push(e.key);
			let moveToNext = false;
			const num = parseInt(e.key);
			this.#updateSegment("year", (prev) => {
				if (this.#root.states.year.hasLeftFocus) {
					prev = null;
					this.#root.states.year.hasLeftFocus = false;
				}

				if (prev === null) {
					this.#announcer.announce(num);
					return `000${num}`;
				}

				const str = prev.toString() + num.toString();
				const mergedInt = parseInt(str);
				const mergedIntDigits = String(mergedInt).length;

				if (mergedIntDigits < 4) {
					/**
					 * If the user has backspaced and hasn't typed enough digits to make up
					 * for the amount of backspaces, then we want to keep them in the segment
					 * and not prepend any zeroes to the number.
					 */
					if (
						this.#backspaceCount > 0 &&
						this.#pressedKeys.length <= this.#backspaceCount &&
						str.length <= 4
					) {
						this.#announcer.announce(mergedInt);
						return str;
					}

					/**
					 * If the mergedInt is less than 4 digits and we haven't backspaced,
					 * then we want to prepend zeroes to the number to keep the format
					 * of `YYYY`
					 */
					this.#announcer.announce(mergedInt);
					return prependYearZeros(mergedInt);
				}

				this.#announcer.announce(mergedInt);
				moveToNext = true;
				return `${mergedInt}`;
			});

			if (
				this.#pressedKeys.length === 4 ||
				this.#pressedKeys.length === this.#backspaceCount
			) {
				moveToNext = true;
			}

			if (moveToNext) {
				moveToNextSegment(e, this.#root.getFieldNode());
			}
		}

		if (isBackspace(e.key)) {
			this.#pressedKeys = [];
			this.#incrementBackspaceCount();
			let moveToPrev = false;
			this.#updateSegment("year", (prev) => {
				this.#root.states.year.hasLeftFocus = false;
				if (prev === null) {
					moveToPrev = true;
					this.#announcer.announce(null);
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					this.#announcer.announce(null);
					return null;
				}
				const next = str.slice(0, -1);
				this.#announcer.announce(next);

				return `${next}`;
			});

			if (moveToPrev) {
				moveToPrevSegment(e, this.#root.getFieldNode());
			}
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.getFieldNode());
		}
	};

	#onfocusout = () => {
		this.#root.states.year.hasLeftFocus = true;
		this.#pressedKeys = [];
		this.#resetBackspaceCount();
		this.#updateSegment("year", (prev) => {
			if (prev && prev.length !== 4) {
				return prependYearZeros(parseInt(prev));
			}
			return prev;
		});
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		const placeholder = this.#root.placeholder.value;
		const isEmpty = segmentValues.year === null;
		const date = segmentValues.year
			? placeholder.set({ year: parseInt(segmentValues.year) })
			: placeholder;
		const valueMin = 1;
		const valueMax = 9999;
		const valueNow = date.year;
		const valueText = isEmpty ? "Empty" : `${valueNow}`;

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			"aria-label": "year, ",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onclick: this.#root.handleSegmentClick,
			onfocusout: this.#onfocusout,
			...this.#root.getBaseSegmentAttrs("year", this.#id.value),
		};
	});
}

type DateFieldHourSegmentStateProps = WithRefProps;

class DateFieldHourSegmentState {
	#id: DateFieldHourSegmentStateProps["id"];
	#ref: DateFieldHourSegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldHourSegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;
		this.#announcer = this.#root.announcer;
		this.#updateSegment = this.#root.updateSegment;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		const placeholder = this.#root.placeholder.value;
		if (e.ctrlKey || e.metaKey || this.#root.disabled.value || !("hour" in placeholder)) return;
		if (e.key !== kbd.TAB) e.preventDefault();
		if (!isAcceptableSegmentKey(e.key)) return;

		const hourCycle = this.#root.hourCycle.value;

		if (isArrowUp(e.key)) {
			this.#updateSegment("hour", (prev) => {
				if (prev === null) {
					const next = placeholder.cycle("hour", 1, { hourCycle }).hour;
					this.#announcer.announce(next);
					return `${next}`;
				}
				const next = placeholder
					.set({ hour: parseInt(prev) })
					.cycle("hour", 1, { hourCycle }).hour;

				if (
					next === 0 &&
					"dayPeriod" in this.#root.segmentValues &&
					this.#root.segmentValues.dayPeriod !== null &&
					this.#root.hourCycle.value !== 24
				) {
					this.#announcer.announce("12");
					return "12";
				}
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isArrowDown(e.key)) {
			this.#updateSegment("hour", (prev) => {
				if (prev === null) {
					const next = placeholder.cycle("hour", -1, { hourCycle }).hour;
					this.#announcer.announce(next);
					return `${next}`;
				}
				const next = placeholder
					.set({ hour: parseInt(prev) })
					.cycle("hour", -1, { hourCycle }).hour;

				if (
					next === 0 &&
					"dayPeriod" in this.#root.segmentValues &&
					this.#root.segmentValues.dayPeriod !== null &&
					this.#root.hourCycle.value !== 24
				) {
					this.#announcer.announce("12");
					return "12";
				}
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			const max =
				"dayPeriod" in this.#root.segmentValues &&
				this.#root.segmentValues.dayPeriod !== null
					? 12
					: 23;
			console.log("max", max);
			const maxStart = Math.floor(max / 10);
			let moveToNext = false;
			const numIsZero = num === 0;
			this.#updateSegment("hour", (prev) => {
				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (this.#root.states.hour.hasLeftFocus) {
					prev = null;
					this.#root.states.hour.hasLeftFocus = false;
				}

				/**
				 * We are starting over in the segment if prev is null, which could
				 * happen in one of two scenarios:
				 * - the user has left the segment and then comes back to it
				 * - the segment was empty and the user begins typing a number
				 */
				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (numIsZero) {
						this.#root.states.hour.lastKeyZero = true;
						this.#announcer.announce("0");
						return "0";
					}

					///////////////////////////

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (0-3 in most cases), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (this.#root.states.hour.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}

					this.#root.states.hour.lastKeyZero = false;

					/**
					 * If we're moving to the next segment and the number is less than
					 * two digits, we want to announce the number and return it with a
					 * leading zero to follow the placeholder format of `MM/DD/YYYY`.
					 */
					if (moveToNext && String(num).length === 1) {
						this.#announcer.announce(num);
						return `0${num}`;
					}

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return `${num}`;
				}

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * hour, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				const total = parseInt(prev + num.toString());

				if (this.#root.states.hour.lastKeyZero) {
					/**
					 * If the new number is not 0, then we reset the lastKeyZero state and
					 * move to the next segment, returning the new number with a leading 0.
					 */
					if (num !== 0) {
						moveToNext = true;
						this.#root.states.hour.lastKeyZero = false;
						return `0${num}`;
					}

					/**
					 * If the new number is 0, then we simply return the previous value, since
					 * they didn't actually type a new number.
					 */
					return prev;
				}

				/**
				 * If the total is greater than the max day value possible for this month, then
				 * we want to move to the next segment, trimming the first digit from the total,
				 * replacing it with a 0.
				 */
				if (total > max) {
					moveToNext = true;
					return `0${num}`;
				}

				/**
				 * If the total has two digits and is less than or equal to the max day value,
				 * we will move to the next segment and return the total as the segment value.
				 */
				moveToNext = true;
				return `${total}`;
			});

			if (moveToNext) {
				moveToNextSegment(e, this.#root.getFieldNode());
			}
		}

		if (isBackspace(e.key)) {
			this.#root.states.hour.hasLeftFocus = false;
			let moveToPrev = false;
			this.#updateSegment("hour", (prev) => {
				if (prev === null) {
					this.#announcer.announce(null);
					moveToPrev = true;
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					this.#announcer.announce(null);
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				this.#announcer.announce(next);
				return `${next}`;
			});

			if (moveToPrev) {
				moveToPrevSegment(e, this.#root.getFieldNode());
			}
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.getFieldNode());
		}
	};

	#onfocusout = () => {
		this.#root.states.hour.hasLeftFocus = true;
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		const hourCycle = this.#root.hourCycle.value;
		const placeholder = this.#root.placeholder.value;
		if (!("hour" in segmentValues) || !("hour" in placeholder)) return {};
		const isEmpty = segmentValues.hour === null;
		const date = segmentValues.hour
			? placeholder.set({ hour: parseInt(segmentValues.hour) })
			: placeholder;
		const valueMin = hourCycle === 12 ? 1 : 0;
		const valueMax = hourCycle === 12 ? 12 : 23;
		const valueNow = date.hour;
		const valueText = isEmpty ? "Empty" : `${valueNow} ${segmentValues.dayPeriod ?? ""}`;

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			"aria-label": "hour, ",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onfocusout: this.#onfocusout,
			onclick: this.#root.handleSegmentClick,
			...this.#root.getBaseSegmentAttrs("hour", this.#id.value),
		};
	});
}

type DateFieldMinuteSegmentStateProps = WithRefProps;

class DateFieldMinuteSegmentState {
	#id: DateFieldMinuteSegmentStateProps["id"];
	#ref: DateFieldMinuteSegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldMinuteSegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;
		this.#announcer = this.#root.announcer;
		this.#updateSegment = this.#root.updateSegment;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		const placeholder = this.#root.placeholder.value;
		if (e.ctrlKey || e.metaKey || this.#root.disabled.value || !("minute" in placeholder))
			return;
		if (e.key !== kbd.TAB) e.preventDefault();
		if (!isAcceptableSegmentKey(e.key)) return;

		const min = 0;
		const max = 59;

		if (isArrowUp(e.key)) {
			this.#updateSegment("minute", (prev) => {
				if (prev === null) {
					this.#announcer.announce(min);
					return `${min}`;
				}
				const next = placeholder.set({ minute: parseInt(prev) }).cycle("minute", 1).minute;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isArrowDown(e.key)) {
			this.#updateSegment("minute", (prev) => {
				if (prev === null) {
					this.#announcer.announce(max);
					return `${max}`;
				}
				const next = placeholder.set({ minute: parseInt(prev) }).cycle("minute", -1).minute;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			const numIsZero = num === 0;
			this.#updateSegment("minute", (prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (this.#root.states.minute.hasLeftFocus) {
					prev = null;
					this.#root.states.minute.hasLeftFocus = false;
				}

				/**
				 * We are starting over in the segment if prev is null, which could
				 * happen in one of two scenarios:
				 * - the user has left the segment and then comes back to it
				 * - the segment was empty and the user begins typing a number
				 */
				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (numIsZero) {
						this.#root.states.minute.lastKeyZero = true;
						this.#announcer.announce("0");
						return "0";
					}

					///////////////////////////

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (0-3 in most cases), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (this.#root.states.minute.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}

					this.#root.states.minute.lastKeyZero = false;

					/**
					 * If we're moving to the next segment and the number is less than
					 * two digits, we want to announce the number and return it with a
					 * leading zero to follow the placeholder format of `MM/DD/YYYY`.
					 */
					if (moveToNext && String(num).length === 1) {
						this.#announcer.announce(num);
						return `0${num}`;
					}

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return `${num}`;
				}

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * minute, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				const total = parseInt(prev + num.toString());

				if (this.#root.states.minute.lastKeyZero) {
					/**
					 * If the new number is not 0, then we reset the lastKeyZero state and
					 * move to the next segment, returning the new number with a leading 0.
					 */
					if (num !== 0) {
						moveToNext = true;
						this.#root.states.minute.lastKeyZero = false;
						return `0${num}`;
					}

					/**
					 * If the new number is 0, then we simply return `00` since that is
					 * an acceptable minute value.
					 */
					moveToNext = true;
					this.#root.states.minute.lastKeyZero = false;
					return "00";
				}

				/**
				 * If the total is greater than the max day value possible for this month, then
				 * we want to move to the next segment, trimming the first digit from the total,
				 * replacing it with a 0.
				 */
				if (total > max) {
					moveToNext = true;
					return `0${num}`;
				}

				/**
				 * If the total has two digits and is less than or equal to the max day value,
				 * we will move to the next segment and return the total as the segment value.
				 */
				moveToNext = true;
				return `${total}`;
			});

			if (moveToNext) {
				moveToNextSegment(e, this.#root.getFieldNode());
			}
			return;
		}

		if (isBackspace(e.key)) {
			this.#root.states.minute.hasLeftFocus = false;
			let moveToPrev = false;
			this.#updateSegment("minute", (prev) => {
				if (prev === null) {
					moveToPrev = true;
					this.#announcer.announce("Empty");
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					this.#announcer.announce("Empty");
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				this.#announcer.announce(next);
				return `${next}`;
			});

			if (moveToPrev) {
				moveToPrevSegment(e, this.#root.getFieldNode());
			}
			return;
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.getFieldNode());
		}
	};

	#onfocusout = () => {
		this.#root.states.minute.hasLeftFocus = true;
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		const placeholder = this.#root.placeholder.value;

		if (!("minute" in segmentValues) || !("minute" in placeholder)) return {};
		const isEmpty = segmentValues.minute === null;
		const date = segmentValues.minute
			? placeholder.set({ minute: parseInt(segmentValues.minute) })
			: placeholder;
		const valueNow = date.minute;
		const valueMin = 0;
		const valueMax = 59;
		const valueText = isEmpty ? "Empty" : `${valueNow}`;

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			"aria-label": "minute, ",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onfocusout: this.#onfocusout,
			onclick: this.#root.handleSegmentClick,
			...this.#root.getBaseSegmentAttrs("minute", this.#id.value),
		};
	});
}

type DateFieldSecondSegmentStateProps = WithRefProps;

class DateFieldSecondSegmentState {
	#id: DateFieldSecondSegmentStateProps["id"];
	#ref: DateFieldSecondSegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldSecondSegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;
		this.#announcer = this.#root.announcer;
		this.#updateSegment = this.#root.updateSegment;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		const placeholder = this.#root.placeholder.value;
		if (e.ctrlKey || e.metaKey || this.#root.disabled.value || !("second" in placeholder))
			return;
		if (e.key !== kbd.TAB) e.preventDefault();
		if (!isAcceptableSegmentKey(e.key)) return;

		const min = 0;
		const max = 59;

		if (isArrowUp(e.key)) {
			this.#updateSegment("second", (prev) => {
				if (prev === null) {
					this.#announcer.announce(min);
					return `${min}`;
				}
				const next = placeholder.set({ second: parseInt(prev) }).cycle("second", 1).second;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isArrowDown(e.key)) {
			this.#updateSegment("second", (prev) => {
				if (prev === null) {
					this.#announcer.announce(max);
					return `${max}`;
				}
				const next = placeholder.set({ second: parseInt(prev) }).cycle("second", -1).second;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			const numIsZero = num === 0;
			let moveToNext = false;
			this.#updateSegment("second", (prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (this.#root.states.second.hasLeftFocus) {
					prev = null;
					this.#root.states.second.hasLeftFocus = false;
				}

				/**
				 * We are starting over in the segment if prev is null, which could
				 * happen in one of two scenarios:
				 * - the user has left the segment and then comes back to it
				 * - the segment was empty and the user begins typing a number
				 */
				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (numIsZero) {
						this.#root.states.second.lastKeyZero = true;
						this.#announcer.announce("0");
						return "0";
					}

					///////////////////////////

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (0-3 in most cases), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (this.#root.states.second.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}

					this.#root.states.second.lastKeyZero = false;

					/**
					 * If we're moving to the next segment and the number is less than
					 * two digits, we want to announce the number and return it with a
					 * leading zero to follow the placeholder format of `MM/DD/YYYY`.
					 */
					if (moveToNext && String(num).length === 1) {
						this.#announcer.announce(num);
						return `0${num}`;
					}

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return `${num}`;
				}

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * second, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				const total = parseInt(prev + num.toString());

				if (this.#root.states.second.lastKeyZero) {
					/**
					 * If the new number is not 0, then we reset the lastKeyZero state and
					 * move to the next segment, returning the new number with a leading 0.
					 */
					if (num !== 0) {
						moveToNext = true;
						this.#root.states.second.lastKeyZero = false;
						return `0${num}`;
					}

					/**
					 * If the new number is 0, then we simply return `00` since that is
					 * an acceptable second value.
					 */
					moveToNext = true;
					this.#root.states.second.lastKeyZero = false;
					return "00";
				}

				/**
				 * If the total is greater than the max day value possible for this month, then
				 * we want to move to the next segment, trimming the first digit from the total,
				 * replacing it with a 0.
				 */
				if (total > max) {
					moveToNext = true;
					return `0${num}`;
				}

				/**
				 * If the total has two digits and is less than or equal to the max day value,
				 * we will move to the next segment and return the total as the segment value.
				 */
				moveToNext = true;
				return `${total}`;
			});

			if (moveToNext) {
				moveToNextSegment(e, this.#root.getFieldNode());
			}
		}

		if (isBackspace(e.key)) {
			this.#root.states.second.hasLeftFocus = false;
			let moveToPrev = false;
			this.#updateSegment("second", (prev) => {
				if (prev === null) {
					moveToPrev = true;
					this.#announcer.announce(null);
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					this.#announcer.announce(null);
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				this.#announcer.announce(next);
				return `${next}`;
			});

			if (moveToPrev) {
				moveToPrevSegment(e, this.#root.getFieldNode());
			}
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.getFieldNode());
		}
	};

	#onfocusout = () => {
		this.#root.states.second.hasLeftFocus = true;
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		const placeholder = this.#root.placeholder.value;
		if (!("second" in segmentValues) || !("second" in placeholder)) return {};
		const isEmpty = segmentValues.second === null;
		const date = segmentValues.second
			? placeholder.set({ second: parseInt(segmentValues.second) })
			: placeholder;
		const valueNow = date.second;
		const valueMin = 0;
		const valueMax = 59;
		const valueText = isEmpty ? "Empty" : `${valueNow}`;

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			"aria-label": "second, ",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onfocusout: this.#onfocusout,
			onclick: this.#root.handleSegmentClick,
			...this.#root.getBaseSegmentAttrs("second", this.#id.value),
		};
	});
}

type DateFieldDayPeriodSegmentStateProps = WithRefProps;

class DateFieldDayPeriodSegmentState {
	#id: DateFieldDayPeriodSegmentStateProps["id"];
	#ref: DateFieldDayPeriodSegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldDayPeriodSegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;
		this.#announcer = this.#root.announcer;
		this.#updateSegment = this.#root.updateSegment;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.dayPeriodNode = node;
			},
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (e.ctrlKey || e.metaKey || this.#root.disabled.value) return;

		if (e.key !== kbd.TAB) e.preventDefault();
		if (!isAcceptableDayPeriodKey(e.key)) return;

		if (isArrowUp(e.key) || isArrowDown(e.key)) {
			this.#updateSegment("dayPeriod", (prev) => {
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
			this.#root.states.dayPeriod.hasLeftFocus = false;
			this.#updateSegment("dayPeriod", () => {
				const next = "AM";
				this.#announcer.announce(next);
				return next;
			});
		}

		if (e.key === kbd.A || e.key === kbd.P) {
			this.#updateSegment("dayPeriod", () => {
				const next = e.key === kbd.A ? "AM" : "PM";
				this.#announcer.announce(next);
				return next;
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.getFieldNode());
		}
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		if (!("dayPeriod" in segmentValues)) return;

		const valueMin = 0;
		const valueMax = 12;
		const valueNow = segmentValues.dayPeriod ?? 0;
		const valueText = segmentValues.dayPeriod ?? "AM";

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			inputmode: "text",
			"aria-label": "AM/PM",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onclick: this.#root.handleSegmentClick,
			...this.#root.getBaseSegmentAttrs("dayPeriod", this.#id.value),
		};
	});
}

type DateFieldLiteralSegmentStateProps = WithRefProps;

class DateFieldDayLiteralSegmentState {
	#id: DateFieldLiteralSegmentStateProps["id"];
	#ref: DateFieldLiteralSegmentStateProps["ref"];
	#root: DateFieldRootState;

	constructor(props: DateFieldLiteralSegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				"aria-hidden": getAriaHidden(true),
				...this.#root.getBaseSegmentAttrs("literal", this.#id.value),
			}) as const
	);
}

type DateFieldTimeZoneSegmentStateProps = WithRefProps;

class DateFieldTimeZoneSegmentState {
	#id: DateFieldTimeZoneSegmentStateProps["id"];
	#ref: DateFieldTimeZoneSegmentStateProps["ref"];
	#root: DateFieldRootState;

	constructor(props: DateFieldMinuteSegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (e.key !== kbd.TAB) e.preventDefault();
		if (this.#root.disabled.value) return;
		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.getFieldNode());
		}
	};

	props = $derived.by(
		() =>
			({
				role: "textbox",
				id: this.#id.value,
				"aria-label": "timezone, ",
				"data-readonly": getDataReadonly(true),
				tabindex: 0,
				style: {
					caretColor: "transparent",
				},
				onkeydown: this.#onkeydown,
				...this.#root.getBaseSegmentAttrs("timeZoneName", this.#id.value),
			}) as const
	);
}

// Utils/helpers

function isAcceptableDayPeriodKey(key: string) {
	return isAcceptableSegmentKey(key) || key === kbd.A || key === kbd.P;
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

const [setDateFieldRootContext, getDateFieldRootContext] =
	createContext<DateFieldRootState>("DateField.Root");

export function useDateFieldRoot(props: DateFieldRootStateProps) {
	return setDateFieldRootContext(new DateFieldRootState(props));
}

export function useDateFieldInput(props: DateFieldInputStateProps) {
	return getDateFieldRootContext().createInput(props);
}

export function useDateFieldHiddenInput() {
	return getDateFieldRootContext().createHiddenInput();
}

export function useDateFieldSegment(part: SegmentPart, props: WithRefProps) {
	return getDateFieldRootContext().createSegment(part, props);
}

export function useDateFieldLabel(props: DateFieldLabelStateProps) {
	return getDateFieldRootContext().createLabel(props);
}

type SegmentPartToInstanceProps = {
	part: SegmentPart;
	root: DateFieldRootState;
	segmentProps: WithRefProps;
};

function segmentPartToInstance(props: SegmentPartToInstanceProps) {
	const { part, root, segmentProps } = props;
	switch (part) {
		case "day":
			return new DateFieldDaySegmentState(segmentProps, root);
		case "month":
			return new DateFieldMonthSegmentState(segmentProps, root);
		case "year":
			return new DateFieldYearSegmentState(segmentProps, root);
		case "hour":
			return new DateFieldHourSegmentState(segmentProps, root);
		case "minute":
			return new DateFieldMinuteSegmentState(segmentProps, root);
		case "second":
			return new DateFieldSecondSegmentState(segmentProps, root);
		case "dayPeriod":
			return new DateFieldDayPeriodSegmentState(segmentProps, root);
		case "literal":
			return new DateFieldDayLiteralSegmentState(segmentProps, root);
		case "timeZoneName":
			return new DateFieldTimeZoneSegmentState(segmentProps, root);
	}
}

function prependYearZeros(year: number) {
	const digits = String(year).length;
	const diff = 4 - digits;
	return `${"0".repeat(diff)}${year}`;
}
