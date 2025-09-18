import { Label } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestLabelComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Label.Root
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Label.Root
	];
