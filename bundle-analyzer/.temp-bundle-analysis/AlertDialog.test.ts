import { AlertDialog } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestAlertDialogComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		AlertDialog.Root,
	AlertDialog.Title,
	AlertDialog.Action,
	AlertDialog.Cancel,
	AlertDialog.Portal,
	AlertDialog.Content,
	AlertDialog.Overlay,
	AlertDialog.Trigger,
	AlertDialog.Description
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	AlertDialog.Root,
	AlertDialog.Title,
	AlertDialog.Action,
	AlertDialog.Cancel,
	AlertDialog.Portal,
	AlertDialog.Content,
	AlertDialog.Overlay,
	AlertDialog.Trigger,
	AlertDialog.Description
	];
