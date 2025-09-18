import { ContextMenu } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestContextMenuComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		ContextMenu.Root,
	ContextMenu.Sub,
	ContextMenu.Item,
	ContextMenu.Group,
	ContextMenu.GroupHeading,
	ContextMenu.Arrow,
	ContextMenu.Content,
	ContextMenu.ContentStatic,
	ContextMenu.Trigger,
	ContextMenu.RadioItem,
	ContextMenu.Separator,
	ContextMenu.RadioGroup,
	ContextMenu.SubContent,
	ContextMenu.SubContentStatic,
	ContextMenu.SubTrigger,
	ContextMenu.CheckboxItem,
	ContextMenu.Portal,
	ContextMenu.CheckboxGroup
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	ContextMenu.Root,
	ContextMenu.Sub,
	ContextMenu.Item,
	ContextMenu.Group,
	ContextMenu.GroupHeading,
	ContextMenu.Arrow,
	ContextMenu.Content,
	ContextMenu.ContentStatic,
	ContextMenu.Trigger,
	ContextMenu.RadioItem,
	ContextMenu.Separator,
	ContextMenu.RadioGroup,
	ContextMenu.SubContent,
	ContextMenu.SubContentStatic,
	ContextMenu.SubTrigger,
	ContextMenu.CheckboxItem,
	ContextMenu.Portal,
	ContextMenu.CheckboxGroup
	];
