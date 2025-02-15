<script lang="ts">
	import { DropdownMenu } from "bits-ui";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger data-testid="trigger">open</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content data-testid="content">
			<DropdownMenu.Separator data-testid="separator" />
			<DropdownMenu.Group data-testid="group">
				<DropdownMenu.GroupHeading data-testid="group-heading"
					>Stuff</DropdownMenu.GroupHeading
				>
				<DropdownMenu.Item data-testid="item">
					<span>item</span>
				</DropdownMenu.Item>
			</DropdownMenu.Group>

			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger data-testid="sub-trigger">
					<span>subtrigger</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent data-testid="sub-content">
					<DropdownMenu.Item data-testid="sub-item">
						<span>Email</span>
					</DropdownMenu.Item>
					<DropdownMenu.CheckboxItem data-testid="sub-checkbox-item">
						{#snippet children({ checked, indeterminate: _indeterminate })}
							<span data-testid="sub-checkbox-indicator">
								{checked}
							</span>
							sub checkbox
						{/snippet}
					</DropdownMenu.CheckboxItem>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Item disabled data-testid="disabled-item">disabled item</DropdownMenu.Item
			>
			<DropdownMenu.Item disabled data-testid="disabled-item-2"
				>disabled item 2</DropdownMenu.Item
			>
			<DropdownMenu.CheckboxItem data-testid="checkbox-item">
				{#snippet children({ checked, indeterminate: _indeterminate })}
					<span data-testid="checkbox-indicator">
						{checked}
					</span>
					Checkbox Item
				{/snippet}
			</DropdownMenu.CheckboxItem>
			<DropdownMenu.Item data-testid="item-2">item 2</DropdownMenu.Item>
			<DropdownMenu.RadioGroup data-testid="radio-group">
				<DropdownMenu.RadioItem value="1" data-testid="radio-item">
					{#snippet children({ checked })}
						<span data-testid="radio-indicator-1"> {checked} </span>
						<span>Radio Item 1</span>
					{/snippet}
				</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="2" data-testid="radio-item-2">
					{#snippet children({ checked })}
						<span data-testid="radio-indicator-2"> {checked} </span>
						<span>Radio Item 2</span>
					{/snippet}
				</DropdownMenu.RadioItem>
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
