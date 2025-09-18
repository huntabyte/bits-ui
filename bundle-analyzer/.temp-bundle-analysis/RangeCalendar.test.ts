import { RangeCalendar } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestRangeCalendarComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		RangeCalendar.Root,
	RangeCalendar.Day,
	RangeCalendar.Cell,
	RangeCalendar.Grid,
	RangeCalendar.GridBody,
	RangeCalendar.GridHead,
	RangeCalendar.HeadCell,
	RangeCalendar.GridRow,
	RangeCalendar.Header,
	RangeCalendar.Heading,
	RangeCalendar.NextButton,
	RangeCalendar.PrevButton,
	RangeCalendar.MonthSelect,
	RangeCalendar.YearSelect
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	RangeCalendar.Root,
	RangeCalendar.Day,
	RangeCalendar.Cell,
	RangeCalendar.Grid,
	RangeCalendar.GridBody,
	RangeCalendar.GridHead,
	RangeCalendar.HeadCell,
	RangeCalendar.GridRow,
	RangeCalendar.Header,
	RangeCalendar.Heading,
	RangeCalendar.NextButton,
	RangeCalendar.PrevButton,
	RangeCalendar.MonthSelect,
	RangeCalendar.YearSelect
	];
