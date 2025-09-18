import { Menubar } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestMenubarComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Menubar.Root,
	Menubar.Menu,
	Menubar.Content,
	Menubar.ContentStatic,
	Menubar.Trigger,
	Menubar.Sub,
	Menubar.Item,
	Menubar.Group,
	Menubar.GroupHeading,
	Menubar.Arrow,
	Menubar.RadioItem,
	Menubar.Separator,
	Menubar.SubContent,
	Menubar.SubContentStatic,
	Menubar.SubTrigger,
	Menubar.RadioGroup,
	Menubar.CheckboxItem,
	Menubar.Portal,
	Menubar.CheckboxGroup
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Menubar.Root,
	Menubar.Menu,
	Menubar.Content,
	Menubar.ContentStatic,
	Menubar.Trigger,
	Menubar.Sub,
	Menubar.Item,
	Menubar.Group,
	Menubar.GroupHeading,
	Menubar.Arrow,
	Menubar.RadioItem,
	Menubar.Separator,
	Menubar.SubContent,
	Menubar.SubContentStatic,
	Menubar.SubTrigger,
	Menubar.RadioGroup,
	Menubar.CheckboxItem,
	Menubar.Portal,
	Menubar.CheckboxGroup
	];
