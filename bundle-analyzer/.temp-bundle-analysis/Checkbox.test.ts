import { Checkbox } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestCheckboxComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Checkbox.Root,
	Checkbox.Group,
	Checkbox.GroupLabel
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Checkbox.Root,
	Checkbox.Group,
	Checkbox.GroupLabel
	];
