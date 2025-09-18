import { Calendar } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestCalendarComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Calendar.Root,
	Calendar.Day,
	Calendar.Grid,
	Calendar.GridBody,
	Calendar.Cell,
	Calendar.GridHead,
	Calendar.HeadCell,
	Calendar.GridRow,
	Calendar.Header,
	Calendar.Heading,
	Calendar.MonthSelect,
	Calendar.NextButton,
	Calendar.PrevButton,
	Calendar.YearSelect
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Calendar.Root,
	Calendar.Day,
	Calendar.Grid,
	Calendar.GridBody,
	Calendar.Cell,
	Calendar.GridHead,
	Calendar.HeadCell,
	Calendar.GridRow,
	Calendar.Header,
	Calendar.Heading,
	Calendar.MonthSelect,
	Calendar.NextButton,
	Calendar.PrevButton,
	Calendar.YearSelect
	];
