import { DateRangePicker } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestDateRangePickerComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		DateRangePicker.Root,
	DateRangePicker.Calendar,
	DateRangePicker.Trigger,
	DateRangePicker.Content,
	DateRangePicker.Arrow,
	DateRangePicker.Close,
	DateRangePicker.Input,
	DateRangePicker.Label,
	DateRangePicker.Segment,
	DateRangePicker.GridBody,
	DateRangePicker.GridHead,
	DateRangePicker.GridRow,
	DateRangePicker.Grid,
	DateRangePicker.HeadCell,
	DateRangePicker.Header,
	DateRangePicker.Heading,
	DateRangePicker.NextButton,
	DateRangePicker.PrevButton,
	DateRangePicker.MonthSelect,
	DateRangePicker.YearSelect,
	DateRangePicker.Cell,
	DateRangePicker.Day
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	DateRangePicker.Root,
	DateRangePicker.Calendar,
	DateRangePicker.Trigger,
	DateRangePicker.Content,
	DateRangePicker.Arrow,
	DateRangePicker.Close,
	DateRangePicker.Input,
	DateRangePicker.Label,
	DateRangePicker.Segment,
	DateRangePicker.GridBody,
	DateRangePicker.GridHead,
	DateRangePicker.GridRow,
	DateRangePicker.Grid,
	DateRangePicker.HeadCell,
	DateRangePicker.Header,
	DateRangePicker.Heading,
	DateRangePicker.NextButton,
	DateRangePicker.PrevButton,
	DateRangePicker.MonthSelect,
	DateRangePicker.YearSelect,
	DateRangePicker.Cell,
	DateRangePicker.Day
	];
