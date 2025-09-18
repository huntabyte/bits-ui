import { Dialog } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestDialogComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Dialog.Root,
	Dialog.Title,
	Dialog.Close,
	Dialog.Portal,
	Dialog.Content,
	Dialog.Overlay,
	Dialog.Trigger,
	Dialog.Description
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Dialog.Root,
	Dialog.Title,
	Dialog.Close,
	Dialog.Portal,
	Dialog.Content,
	Dialog.Overlay,
	Dialog.Trigger,
	Dialog.Description
	];
