import { Combobox } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestComboboxComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Combobox.Root,
	Combobox.Input,
	Combobox.Separator,
	Combobox.Arrow,
	Combobox.Trigger,
	Combobox.Portal,
	Combobox.Content,
	Combobox.ContentStatic,
	Combobox.Item,
	Combobox.Group,
	Combobox.GroupHeading,
	Combobox.Viewport,
	Combobox.ScrollDownButton,
	Combobox.ScrollUpButton
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Combobox.Root,
	Combobox.Input,
	Combobox.Separator,
	Combobox.Arrow,
	Combobox.Trigger,
	Combobox.Portal,
	Combobox.Content,
	Combobox.ContentStatic,
	Combobox.Item,
	Combobox.Group,
	Combobox.GroupHeading,
	Combobox.Viewport,
	Combobox.ScrollDownButton,
	Combobox.ScrollUpButton
	];
