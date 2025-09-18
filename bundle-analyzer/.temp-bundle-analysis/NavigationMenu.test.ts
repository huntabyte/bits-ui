import { NavigationMenu } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestNavigationMenuComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		NavigationMenu.Root,
	NavigationMenu.Content,
	NavigationMenu.Indicator,
	NavigationMenu.Item,
	NavigationMenu.Link,
	NavigationMenu.List,
	NavigationMenu.Trigger,
	NavigationMenu.Viewport,
	NavigationMenu.Sub
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	NavigationMenu.Root,
	NavigationMenu.Content,
	NavigationMenu.Indicator,
	NavigationMenu.Item,
	NavigationMenu.Link,
	NavigationMenu.List,
	NavigationMenu.Trigger,
	NavigationMenu.Viewport,
	NavigationMenu.Sub
	];
