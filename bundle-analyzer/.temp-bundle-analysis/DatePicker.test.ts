import { DatePicker } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestDatePickerComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		DatePicker.Root,
	DatePicker.Calendar,
	DatePicker.Content,
	DatePicker.ContentStatic,
	DatePicker.Trigger,
	DatePicker.Arrow,
	DatePicker.Close,
	DatePicker.Input,
	DatePicker.Label,
	DatePicker.Segment,
	DatePicker.GridBody,
	DatePicker.GridHead,
	DatePicker.GridRow,
	DatePicker.Grid,
	DatePicker.HeadCell,
	DatePicker.Header,
	DatePicker.Heading,
	DatePicker.NextButton,
	DatePicker.PrevButton,
	DatePicker.MonthSelect,
	DatePicker.YearSelect,
	DatePicker.Cell,
	DatePicker.Day,
	DatePicker.Portal
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	DatePicker.Root,
	DatePicker.Calendar,
	DatePicker.Content,
	DatePicker.ContentStatic,
	DatePicker.Trigger,
	DatePicker.Arrow,
	DatePicker.Close,
	DatePicker.Input,
	DatePicker.Label,
	DatePicker.Segment,
	DatePicker.GridBody,
	DatePicker.GridHead,
	DatePicker.GridRow,
	DatePicker.Grid,
	DatePicker.HeadCell,
	DatePicker.Header,
	DatePicker.Heading,
	DatePicker.NextButton,
	DatePicker.PrevButton,
	DatePicker.MonthSelect,
	DatePicker.YearSelect,
	DatePicker.Cell,
	DatePicker.Day,
	DatePicker.Portal
	];
