import { Toolbar } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestToolbarComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Toolbar.Root,
	Toolbar.Button,
	Toolbar.Link,
	Toolbar.Group,
	Toolbar.GroupItem
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Toolbar.Root,
	Toolbar.Button,
	Toolbar.Link,
	Toolbar.Group,
	Toolbar.GroupItem
	];
