<script lang="ts" module>
	import { ContextMenu, Dialog, DropdownMenu } from "bits-ui";
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
</main>
