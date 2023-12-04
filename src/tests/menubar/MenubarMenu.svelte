<script lang="ts" context="module">
	export type MenubarMenuProps = Menubar.MenuProps & {
		checked?: boolean;
		subChecked?: boolean;
		radio?: string;
		subRadio?: string;
		open?: boolean;
	};
</script>

<script lang="ts">
	import { Menubar } from "$lib";

	export let id: string;
</script>

<Menubar.Menu {...$$restProps}>
	<Menubar.Trigger data-testid="{id}-trigger">open</Menubar.Trigger>
	<Menubar.Content data-testid="{id}-content">
		<Menubar.Separator data-testid="{id}-separator" />
		<Menubar.Group data-testid="{id}-group">
			<Menubar.Label data-testid="{id}-label">Stuff</Menubar.Label>
			<Menubar.Item data-testid="{id}-item">
				<span>item</span>
			</Menubar.Item>
		</Menubar.Group>

		<Menubar.Sub>
			<Menubar.SubTrigger data-testid="{id}-sub-trigger">
				<span>subtrigger</span>
			</Menubar.SubTrigger>
			<Menubar.SubContent data-testid="{id}-sub-content">
				<Menubar.Item data-testid="{id}-sub-item">
					<span>Email</span>
				</Menubar.Item>
				<Menubar.CheckboxItem data-testid="{id}-sub-checkbox-item">
					<Menubar.CheckboxIndicator data-testid="{id}-sub-checkbox-indicator">
						checked
					</Menubar.CheckboxIndicator>
					sub checkbox
				</Menubar.CheckboxItem>
			</Menubar.SubContent>
		</Menubar.Sub>
		<Menubar.Item disabled data-testid="{id}-disabled-item"
			>disabled item</Menubar.Item
		>
		<Menubar.Item disabled data-testid="{id}-disabled-item-2"
			>disabled item 2</Menubar.Item
		>
		<Menubar.CheckboxItem data-testid="{id}-checkbox-item">
			<Menubar.CheckboxIndicator data-testid="{id}-checkbox-indicator">
				checked
			</Menubar.CheckboxIndicator>
			Checkbox Item
		</Menubar.CheckboxItem>
		<Menubar.Item data-testid="{id}-item-2">item 2</Menubar.Item>
		<Menubar.RadioGroup data-testid="{id}-radio-group">
			<Menubar.RadioItem value="1" data-testid="{id}-radio-item">
				<Menubar.RadioIndicator>
					<span data-testid="{id}-radio-indicator-1"> checked </span>
				</Menubar.RadioIndicator>
				<span>Radio Item 1</span>
			</Menubar.RadioItem>
			<Menubar.RadioItem value="2" data-testid="{id}-radio-item-2">
				<Menubar.RadioIndicator>
					<span data-testid="{id}-radio-indicator-2"> checked </span>
				</Menubar.RadioIndicator>
				<span>Radio Item 2</span>
			</Menubar.RadioItem>
		</Menubar.RadioGroup>
	</Menubar.Content>
</Menubar.Menu>
