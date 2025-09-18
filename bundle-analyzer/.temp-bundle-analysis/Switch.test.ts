import { Switch } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestSwitchComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Switch.Root,
	Switch.Thumb
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Switch.Root,
	Switch.Thumb
	];
