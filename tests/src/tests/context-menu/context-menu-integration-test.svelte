<script lang="ts" module>
	import { ContextMenu, Dialog, DropdownMenu, Popover, Select } from "bits-ui";
	export type ContextMenuTestProps = ContextMenu.RootProps & {
		checked?: boolean;
		subChecked?: boolean;
		radio?: string;
		subRadio?: string;
		open?: boolean;
		group?: string[];
		contentProps?: Omit<ContextMenu.ContentProps, "children" | "child">;
		portalProps?: Omit<ContextMenu.PortalProps, "children" | "child">;
		subTriggerProps?: Omit<ContextMenu.SubTriggerProps, "children" | "child">;
		checkboxGroupProps?: Omit<ContextMenu.CheckboxGroupProps, "children" | "child" | "value">;
		openFocusOverride?: boolean;
	};
</script>

{#snippet contextMenu({ id }: { id: string })}
	<ContextMenu.Root>
		<ContextMenu.Trigger
			data-testid="context-trigger-{id}"
			class="z-[100] h-[500px] w-[500px]"
			aria-expanded={undefined}
			aria-controls={undefined}
		>
			open
		</ContextMenu.Trigger>
		<ContextMenu.Portal>
			<ContextMenu.Content data-testid="context-content-{id}">
				<ContextMenu.Item>
					<span>item</span>
				</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Portal>
	</ContextMenu.Root>
{/snippet}

<main class="flex flex-col gap-16">
	{@render contextMenu({ id: "1" })}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger data-testid="dropdown-trigger">open</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownMenu.Content data-testid="dropdown-content">
				<DropdownMenu.Item>Hello</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
	{@render contextMenu({ id: "2" })}

	<Dialog.Root>
		<Dialog.Trigger data-testid="dialog-trigger">open</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Content data-testid="dialog-content" class="z-[10]">
				{@render contextMenu({ id: "3" })}
				<Dialog.Close data-testid="dialog-close">close</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>

	<Popover.Root>
		<Popover.Trigger data-testid="popover-trigger">open</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content data-testid="popover-content">
				{@render contextMenu({ id: "4" })}
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>

	<ContextMenu.Root>
		<ContextMenu.Trigger
			data-testid="context-trigger-0"
			class="z-[100] h-[500px] w-[500px]"
			aria-expanded={undefined}
			aria-controls={undefined}
		>
			<Popover.Root>
				<Popover.Trigger data-testid="popover-trigger-1">open</Popover.Trigger>
				<Popover.Portal>
					<Popover.Content data-testid="popover-content-1">Hello</Popover.Content>
				</Popover.Portal>
			</Popover.Root>
			<Select.Root type="single">
				<Select.Trigger data-testid="select-trigger-1">open</Select.Trigger>
				<Select.Portal>
					<Select.Content data-testid="select-content-1">
						<Select.Item value="1">Hello</Select.Item>
					</Select.Content>
				</Select.Portal>
			</Select.Root>
			<Select.Root type="single">
				<Select.Trigger data-testid="select-trigger-2">open</Select.Trigger>
				<Select.Portal>
					<Select.Content data-testid="select-content-2">
						<Select.Item value="1">Hello</Select.Item>
					</Select.Content>
				</Select.Portal>
			</Select.Root>
		</ContextMenu.Trigger>
		<ContextMenu.Portal>
			<ContextMenu.Content data-testid="context-content-0">
				<ContextMenu.Item>
					<span>item</span>
				</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Portal>
	</ContextMenu.Root>
</main>
