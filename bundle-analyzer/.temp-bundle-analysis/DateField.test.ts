import { DateField } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestDateFieldComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		DateField.Root,
	DateField.Input,
	DateField.Label,
	DateField.Segment
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	DateField.Root,
	DateField.Input,
	DateField.Label,
	DateField.Segment
	];
