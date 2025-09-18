import { Toggle } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestToggleComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Toggle.Root
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Toggle.Root
	];
