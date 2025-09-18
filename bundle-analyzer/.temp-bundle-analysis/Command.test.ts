import { Command } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestCommandComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Command.Root,
	Command.Empty,
	Command.Group,
	Command.GroupHeading,
	Command.GroupItems,
	Command.Input,
	Command.Item,
	Command.LinkItem,
	Command.List,
	Command.Viewport,
	Command.Loading,
	Command.Separator
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Command.Root,
	Command.Empty,
	Command.Group,
	Command.GroupHeading,
	Command.GroupItems,
	Command.Input,
	Command.Item,
	Command.LinkItem,
	Command.List,
	Command.Viewport,
	Command.Loading,
	Command.Separator
	];
