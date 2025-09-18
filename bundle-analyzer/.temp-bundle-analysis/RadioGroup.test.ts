import { RadioGroup } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestRadioGroupComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		RadioGroup.Root,
	RadioGroup.Item
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	RadioGroup.Root,
	RadioGroup.Item
	];
