import { Progress } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestProgressComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Progress.Root
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Progress.Root
	];
