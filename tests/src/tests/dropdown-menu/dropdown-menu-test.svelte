<script lang="ts" module>
	import { DropdownMenu } from "bits-ui";
	export type DropdownMenuTestProps = DropdownMenu.RootProps & {
		checked?: boolean;
		subChecked?: boolean;
		radio?: string;
		subRadio?: string;
		open?: boolean;
		group?: string[];
		contentProps?: Omit<DropdownMenu.ContentProps, "children" | "child">;
		portalProps?: Omit<DropdownMenu.PortalProps, "children" | "child">;
		subTriggerProps?: Omit<DropdownMenu.SubTriggerProps, "children" | "child">;
		checkboxGroupProps?: Omit<DropdownMenu.CheckboxGroupProps, "children" | "child" | "value">;
		openFocusOverride?: boolean;
		subItemProps?: Omit<DropdownMenu.ItemProps, "children" | "child">;
	};
</script>

<script lang="ts">
	let {
		checked = false,
		subChecked = false,
		radio = "",
		group = [],
		subRadio = "",
		open = false,
		contentProps = {},
		portalProps = {},
		subTriggerProps = {},
		checkboxGroupProps = {},
		openFocusOverride = false,
		subItemProps = {},
		...restProps
	}: DropdownMenuTestProps = $props();
</script>

<main class="flex flex-col gap-4">
	<div data-testid="outside">outside</div>
	<button data-testid="previous-button">previous button</button>
	<div data-testid="non-portal-container">
		<DropdownMenu.Root bind:open {...restProps}>
			<DropdownMenu.Trigger
				data-testid="trigger"
				class="h-[500px] w-[500px]"
				aria-expanded={undefined}
				aria-controls={undefined}
			>
				open
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal {...portalProps}>
				<DropdownMenu.Content
					{...contentProps}
					data-testid="content"
					class="bg-gray-100 p-4"
				>
					<DropdownMenu.Separator data-testid="separator" />
					<DropdownMenu.Group data-testid="group">
						<DropdownMenu.GroupHeading data-testid="group-heading">
							Stuff
						</DropdownMenu.GroupHeading>
						<DropdownMenu.Item
							data-testid="item"
							class="focus:bg-blue-100 focus:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							<span>item</span>
						</DropdownMenu.Item>
					</DropdownMenu.Group>

					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger data-testid="sub-trigger" {...subTriggerProps}>
							<span>subtrigger</span>
						</DropdownMenu.SubTrigger>
						<DropdownMenu.Portal>
							<DropdownMenu.SubContent data-testid="sub-content">
								<DropdownMenu.Item
									{...subItemProps}
									data-testid="sub-item"
									class="focus:bg-blue-100 focus:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								>
									<span>Email</span>
								</DropdownMenu.Item>
								<DropdownMenu.CheckboxItem
									bind:checked={subChecked}
									data-testid="sub-checkbox-item"
									class="focus:bg-blue-100 focus:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								>
									{#snippet children({ checked, indeterminate: _indeterminate })}
										<span data-testid="sub-checkbox-indicator">
											{checked}
										</span>
										sub checkbox
									{/snippet}
								</DropdownMenu.CheckboxItem>
							</DropdownMenu.SubContent>
						</DropdownMenu.Portal>
					</DropdownMenu.Sub>
					<DropdownMenu.Item
						disabled
						data-testid="disabled-item"
						class="focus:bg-gray-100 focus:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
						>disabled item</DropdownMenu.Item
					>
					<DropdownMenu.Item
						disabled
						data-testid="disabled-item-2"
						class="focus:bg-gray-100 focus:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
						>disabled item 2</DropdownMenu.Item
					>
					<DropdownMenu.CheckboxItem
						bind:checked
						data-testid="checkbox-item"
						class="focus:bg-blue-100 focus:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						{#snippet children({ checked, indeterminate: _indeterminate })}
							<span data-testid="checkbox-indicator">
								{checked}
							</span>
							Checkbox Item
						{/snippet}
					</DropdownMenu.CheckboxItem>
					<DropdownMenu.Item
						data-testid="item-2"
						class="focus:bg-blue-100 focus:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>item 2</DropdownMenu.Item
					>
					<DropdownMenu.RadioGroup bind:value={radio} data-testid="radio-group">
						<DropdownMenu.RadioItem
							value="1"
							data-testid="radio-item"
							class="focus:bg-blue-100 focus:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							{#snippet children({ checked })}
								<span data-testid="radio-indicator-1">
									{checked}
								</span>
								<span>Radio Item 1</span>
							{/snippet}
						</DropdownMenu.RadioItem>
						<DropdownMenu.RadioItem
							value="2"
							data-testid="radio-item-2"
							class="focus:bg-blue-100 focus:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							{#snippet children({ checked })}
								<span data-testid="radio-indicator-2"> {checked} </span>
								<span>Radio Item 2</span>
							{/snippet}
						</DropdownMenu.RadioItem>
					</DropdownMenu.RadioGroup>
					<DropdownMenu.CheckboxGroup
						bind:value={group}
						data-testid="checkbox-group"
						{...checkboxGroupProps}
					>
						<DropdownMenu.CheckboxItem
							value="1"
							data-testid="checkbox-group-item-1"
							class="focus:bg-blue-100 focus:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							{#snippet children({ checked })}
								<span data-testid="checkbox-indicator-1"> {checked} </span>
								<span>Checkbox Item 1</span>
							{/snippet}
						</DropdownMenu.CheckboxItem>
						<DropdownMenu.CheckboxItem
							value="2"
							data-testid="checkbox-group-item-2"
							class="focus:bg-blue-100 focus:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							{#snippet children({ checked })}
								<span data-testid="checkbox-indicator-2"> {checked} </span>
								<span>Checkbox Item 2</span>
							{/snippet}
						</DropdownMenu.CheckboxItem>
					</DropdownMenu.CheckboxGroup>
					{#if openFocusOverride}
						<button data-testid="on-open-focus-override" id="on-open-focus-override"
							>on-open-focus-override</button
						>
					{/if}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	</div>
	<button data-testid="next-button">next button</button>

	<!-- Buttons to test binding -->
	<button data-testid="binding" onclick={() => (open = !open)}>{open}</button>
	<button data-testid="checked-binding" onclick={() => (checked = !checked)}>{checked}</button>
	<button data-testid="sub-checked-binding" onclick={() => (subChecked = !subChecked)}
		>{subChecked}</button
	>
	<button aria-label="radio-main" data-testid="radio-binding" onclick={() => (radio = "")}
		>{radio}</button
	>
	<button aria-label="radio-sub" data-testid="sub-radio-binding" onclick={() => (subRadio = "")}
		>{subRadio}</button
	>
	<button data-testid="on-close-focus-override" id="on-close-focus-override"
		>on-close-focus-override</button
	>
	<button
		aria-label="checkbox-group-binding"
		data-testid="checkbox-group-binding"
		onclick={() => (group = [])}>{group}</button
	>
	<div id="portal-target" data-testid="portal-target"></div>
</main>
