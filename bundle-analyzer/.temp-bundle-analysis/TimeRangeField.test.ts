import { TimeRangeField } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestTimeRangeFieldComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		TimeRangeField.Root,
	TimeRangeField.Input,
	TimeRangeField.Label,
	TimeRangeField.Segment
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	TimeRangeField.Root,
	TimeRangeField.Input,
	TimeRangeField.Label,
	TimeRangeField.Segment
	];
