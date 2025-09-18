import { TimeField } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestTimeFieldComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		TimeField.Root,
	TimeField.Input,
	TimeField.Label,
	TimeField.Segment
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	TimeField.Root,
	TimeField.Input,
	TimeField.Label,
	TimeField.Segment
	];
