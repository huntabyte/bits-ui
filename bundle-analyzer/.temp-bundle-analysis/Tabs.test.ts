import { Tabs } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestTabsComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Tabs.Root,
	Tabs.Content,
	Tabs.List,
	Tabs.Trigger
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Tabs.Root,
	Tabs.Content,
	Tabs.List,
	Tabs.Trigger
	];
