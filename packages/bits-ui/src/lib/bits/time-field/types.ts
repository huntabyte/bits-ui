import type { Time } from "@internationalized/date";
import type { EditableSegmentPart, WithChildren } from "$lib/shared/index.js";
import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type {
	BitsPrimitiveDivAttributes,
	BitsPrimitiveSpanAttributes,
} from "$lib/shared/attributes.js";
import type {
	TimeGranularity,
	TimeOnInvalid,
	TimeSegmentPart,
	TimeValidator,
	TimeValue,
} from "$lib/shared/date/types.js";

export type TimeFieldRootPropsWithoutHTML<T extends TimeValue = Time> = WithChildren<{
	/**
	 * The value of the time field.
	 *
	 * @bindable
	 */
	value?: T;

	/**
	 * A callback that is called when the time field value changes.
	 *
	 */
	onValueChange?: OnChangeFn<T | undefined>;

	/**
	 * The placeholder value of the time field. This determines the format
	 * and what time the field starts at when it is empty.
	 *
	 * @bindable
	 */
	placeholder?: TimeValue;

	/**
	 * A callback that is called when the time field's placeholder value changes.
	 */
	onPlaceholderChange?: OnChangeFn<TimeValue | undefined>;

	/**
	 * A function that returns a string or array of strings as validation errors if the time is
	 * invalid, or nothing if the time is valid
	 */
	validate?: TimeValidator<T>;

	/**
	 * A callback fired when the time field's value is invalid. Use this to display an error
	 * message to the user.
	 */
	onInvalid?: TimeOnInvalid;

	/**
	 * The minimum acceptable time. When provided, the time field
	 * will be marked as invalid if the user enters a time before this time.
	 */
	minValue?: TimeValue;

	/**
	 * The maximum acceptable time. When provided, the time field
	 * will be marked as invalid if the user enters a time after this time.
	 */
	maxValue?: TimeValue;

	/**
	 * If true, the time field will be disabled and users will not be able
	 * to interact with it. This also disables the hidden input element if
	 * the time field is used in a form.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * If true, the time field will be readonly, and users will not be able to
	 * edit the values of any of the individual segments.
	 *
	 * @defaultValue false
	 */
	readonly?: boolean;

	/**
	 * An array of segment names that should be readonly. If provided, only the
	 * segments not in this array will be editable.
	 */
	readonlySegments?: EditableSegmentPart[];

	/**
	 * The format to use for displaying the time in the input.
	 * If using a 12 hour clock, ensure you also include the `dayPeriod`
	 * segment in your input to ensure the user can select AM/PM.
	 *
	 * @defaultValue the locale's default time format
	 */
	hourCycle?: 12 | 24;

	/**
	 * The locale to use for formatting the time field.
	 *
	 * @defaultValue 'en'
	 */
	locale?: string;

	/**
	 * The granularity of the time field. This determines which
	 * segments will be includes in the segments array used to
	 * build the time field.
	 *
	 * Granularity is only used for visual purposes, and does not impact
	 * the value of the time field. You can have the same value synced
	 * between multiple time fields with different granularities and they
	 * will all contain the same value.
	 *
	 * @default 'minute'
	 */
	granularity?: TimeGranularity;

	/**
	 * Whether or not to hide the timeZoneName segment from the time field.
	 *
	 * @default false;
	 */
	hideTimeZone?: boolean;

	/**
	 * Whether or not the hidden input of the time field requires a value
	 * to be submitted.
	 *
	 * @defaultValue false
	 */
	required?: boolean;

	/**
	 * The `id` of the element which contains the error messages for the time field when the
	 * time is invalid.
	 */
	errorMessageId?: string;
}>;

export type TimeFieldRootProps<T extends TimeValue = Time> = TimeFieldRootPropsWithoutHTML<T>;

export type TimeFieldInputSnippetProps = {
	segments: Array<{ part: TimeSegmentPart; value: string }>;
};

export type TimeFieldInputPropsWithoutHTML = WithChild<
	{
		/**
		 * The name to use for the hidden input element of the time field,
		 * which is used to submit the ISO string value of the time field
		 * to a server. If not provided, the hidden input element will not
		 * be rendered.
		 */
		name?: string;
	},
	TimeFieldInputSnippetProps
>;

export type TimeFieldInputProps = TimeFieldInputPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, TimeFieldInputPropsWithoutHTML>;

export type TimeFieldSegmentPropsWithoutHTML = WithChild<{
	part: TimeSegmentPart;
}>;

export type TimeFieldSegmentProps = TimeFieldSegmentPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, TimeFieldSegmentPropsWithoutHTML>;

export type TimeFieldLabelPropsWithoutHTML = WithChild;

export type TimeFieldLabelProps = TimeFieldLabelPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, TimeFieldLabelPropsWithoutHTML>;
