import { ScrollArea } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestScrollAreaComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		ScrollArea.Root,
	ScrollArea.Viewport,
	ScrollArea.Scrollbar,
	ScrollArea.Thumb,
	ScrollArea.Corner
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	ScrollArea.Root,
	ScrollArea.Viewport,
	ScrollArea.Scrollbar,
	ScrollArea.Thumb,
	ScrollArea.Corner
	];
