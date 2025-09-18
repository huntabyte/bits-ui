import { ToggleGroup } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestToggleGroupComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		ToggleGroup.Root,
	ToggleGroup.Item
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	ToggleGroup.Root,
	ToggleGroup.Item
	];
