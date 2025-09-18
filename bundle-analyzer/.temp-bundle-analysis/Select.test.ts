import { Select } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestSelectComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Select.Root,
	Select.Content,
	Select.ContentStatic,
	Select.Item,
	Select.Group,
	Select.GroupHeading,
	Select.Trigger,
	Select.Portal,
	Select.Viewport,
	Select.ScrollUpButton,
	Select.ScrollDownButton
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Select.Root,
	Select.Content,
	Select.ContentStatic,
	Select.Item,
	Select.Group,
	Select.GroupHeading,
	Select.Trigger,
	Select.Portal,
	Select.Viewport,
	Select.ScrollUpButton,
	Select.ScrollDownButton
	];
