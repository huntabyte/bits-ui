import { Popover } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestPopoverComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Popover.Root,
	Popover.Arrow,
	Popover.Content,
	Popover.ContentStatic,
	Popover.Trigger,
	Popover.Close,
	Popover.Portal
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Popover.Root,
	Popover.Arrow,
	Popover.Content,
	Popover.ContentStatic,
	Popover.Trigger,
	Popover.Close,
	Popover.Portal
	];
