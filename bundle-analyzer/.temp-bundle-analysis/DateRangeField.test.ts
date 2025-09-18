import { DateRangeField } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestDateRangeFieldComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		DateRangeField.Root,
	DateRangeField.Input,
	DateRangeField.Label,
	DateRangeField.Segment
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	DateRangeField.Root,
	DateRangeField.Input,
	DateRangeField.Label,
	DateRangeField.Segment
	];
