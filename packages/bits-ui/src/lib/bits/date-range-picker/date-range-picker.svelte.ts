import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { createContext } from "$lib/internal/createContext.js";
import type { DateMatcher, Granularity, HourCycle, WeekStartsOn } from "$lib/shared/date/types.js";
import type { DateRange, SegmentPart } from "$lib/shared/index.js";
import type { DateValue } from "@internationalized/date";

type DateRangePickerRootStateProps = WritableBoxedValues<{
	value: DateRange;
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
		required: boolean;
		preventDeselect: boolean;
		pagedNavigation: boolean;
		weekStartsOn: WeekStartsOn;
		weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
		fixedWeeks: boolean;
		numberOfMonths: number;
		calendarLabel: string;
		disableDaysOutsideMonth: boolean;
		onRangeSelect?: () => void;
	}>;

class DateRangePickerRootState {
	constructor(readonly props: DateRangePickerRootStateProps) {}
}

export const [setDateRangePickerRootContext, getDateRangePickerRootContext] =
	createContext<DateRangePickerRootState>("DateRangePicker.Root");

export function useDateRangePickerRoot(props: DateRangePickerRootStateProps) {
	return setDateRangePickerRootContext(new DateRangePickerRootState(props));
}
