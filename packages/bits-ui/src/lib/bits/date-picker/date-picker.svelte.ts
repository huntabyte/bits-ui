import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { createContext } from "$lib/internal/createContext.js";
import type { DateMatcher, Granularity, HourCycle, WeekStartsOn } from "$lib/shared/date/types.js";
import type { SegmentPart } from "$lib/shared/index.js";
import type { DateValue } from "@internationalized/date";

type DatePickerRootStateProps = WritableBoxedValues<{
	value: DateValue | undefined;
	open: boolean;
	placeholder: DateValue;
}> &
	ReadableBoxedValues<{
		readonlySegments: SegmentPart[];
		isDateUnavailable: DateMatcher;
		isDateDisabled: DateMatcher;
		minValue: DateValue | undefined;
		maxValue: DateValue | undefined;
		disabled: boolean;
		readonly: boolean;
		granularity: Granularity | undefined;
		hourCycle: HourCycle | undefined;
		locale: string;
		hideTimeZone: boolean;
		name: string;
		required: boolean;
		preventDeselect: boolean;
		pagedNavigation: boolean;
		weekStartsOn: WeekStartsOn;
		weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
		fixedWeeks: boolean;
		numberOfMonths: number;
		calendarLabel: string;
		disableDaysOutsideMonth: boolean;
		onDateSelect?: () => void;
	}>;

class DatePickerRootState {
	constructor(readonly props: DatePickerRootStateProps) {}
}

export const [setDatePickerRootContext, getDatePickerRootContext] =
	createContext<DatePickerRootState>("DatePicker.Root");

export function useDatePickerRoot(props: DatePickerRootStateProps) {
	return setDatePickerRootContext(new DatePickerRootState(props));
}
