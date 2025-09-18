import { DropdownMenu } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestDropdownMenuComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		DropdownMenu.Root,
	DropdownMenu.Sub,
	DropdownMenu.Item,
	DropdownMenu.Group,
	DropdownMenu.GroupHeading,
	DropdownMenu.Arrow,
	DropdownMenu.Content,
	DropdownMenu.ContentStatic,
	DropdownMenu.Trigger,
	DropdownMenu.RadioItem,
	DropdownMenu.Separator,
	DropdownMenu.RadioGroup,
	DropdownMenu.SubContent,
	DropdownMenu.SubContentStatic,
	DropdownMenu.SubTrigger,
	DropdownMenu.CheckboxItem,
	DropdownMenu.Portal,
	DropdownMenu.CheckboxGroup
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	DropdownMenu.Root,
	DropdownMenu.Sub,
	DropdownMenu.Item,
	DropdownMenu.Group,
	DropdownMenu.GroupHeading,
	DropdownMenu.Arrow,
	DropdownMenu.Content,
	DropdownMenu.ContentStatic,
	DropdownMenu.Trigger,
	DropdownMenu.RadioItem,
	DropdownMenu.Separator,
	DropdownMenu.RadioGroup,
	DropdownMenu.SubContent,
	DropdownMenu.SubContentStatic,
	DropdownMenu.SubTrigger,
	DropdownMenu.CheckboxItem,
	DropdownMenu.Portal,
	DropdownMenu.CheckboxGroup
	];
