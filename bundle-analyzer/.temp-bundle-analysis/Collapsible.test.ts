import { Collapsible } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestCollapsibleComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Collapsible.Root,
	Collapsible.Content,
	Collapsible.Trigger
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Collapsible.Root,
	Collapsible.Content,
	Collapsible.Trigger
	];
