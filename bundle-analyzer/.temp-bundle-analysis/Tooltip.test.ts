import { Tooltip } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestTooltipComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Tooltip.Root,
	Tooltip.Content,
	Tooltip.ContentStatic,
	Tooltip.Trigger,
	Tooltip.Arrow,
	Tooltip.Provider,
	Tooltip.Portal
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Tooltip.Root,
	Tooltip.Content,
	Tooltip.ContentStatic,
	Tooltip.Trigger,
	Tooltip.Arrow,
	Tooltip.Provider,
	Tooltip.Portal
	];
