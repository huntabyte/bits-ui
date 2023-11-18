<script lang="ts" context="module">
	export type DropdownMenuTestProps = DropdownMenu.Props & {
		checked?: boolean;
		subChecked?: boolean;
		radio?: string;
		subRadio?: string;
		open?: boolean;
	};
</script>

<script lang="ts">
	import { DropdownMenu } from "$lib";

	export let checked = false;
	export let subChecked = false;
	export let radio = "";
	export let subRadio = "";
	export let open = false;
</script>

<main>
	<div data-testid="outside">outside</div>
	<div data-testid="non-portal-container">
		<DropdownMenu.Root bind:open {...$$restProps}>
			<DropdownMenu.Trigger data-testid="trigger">open</DropdownMenu.Trigger>
			<DropdownMenu.Content data-testid="content">
				<DropdownMenu.Separator data-testid="separator" />
				<DropdownMenu.Group data-testid="group">
					<DropdownMenu.Label data-testid="label">Stuff</DropdownMenu.Label>
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
						<DropdownMenu.CheckboxItem
							bind:checked={subChecked}
							data-testid="sub-checkbox-item"
						>
							<DropdownMenu.CheckboxIndicator
								data-testid="sub-checkbox-indicator"
							>
								checked
							</DropdownMenu.CheckboxIndicator>
							sub checkbox
						</DropdownMenu.CheckboxItem>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Item disabled data-testid="disabled-item"
					>disabled item</DropdownMenu.Item
				>
				<DropdownMenu.Item disabled data-testid="disabled-item-2"
					>disabled item 2</DropdownMenu.Item
				>
				<DropdownMenu.CheckboxItem bind:checked data-testid="checkbox-item">
					<DropdownMenu.CheckboxIndicator data-testid="checkbox-indicator">
						checked
					</DropdownMenu.CheckboxIndicator>
					Checkbox Item
				</DropdownMenu.CheckboxItem>
				<DropdownMenu.Item data-testid="item-2">item 2</DropdownMenu.Item>
				<DropdownMenu.RadioGroup bind:value={radio} data-testid="radio-group">
					<DropdownMenu.RadioItem value="1" data-testid="radio-item">
						<DropdownMenu.RadioIndicator>
							<span data-testid="radio-indicator-1"> checked </span>
						</DropdownMenu.RadioIndicator>
						<span>Radio Item 1</span>
					</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="2" data-testid="radio-item-2">
						<DropdownMenu.RadioIndicator>
							<span data-testid="radio-indicator-2"> checked </span>
						</DropdownMenu.RadioIndicator>
						<span>Radio Item 2</span>
					</DropdownMenu.RadioItem>
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<!-- Buttons to test binding -->
	<button data-testid="binding" on:click={() => (open = !open)}>{open}</button>
	<button data-testid="checked-binding" on:click={() => (checked = !checked)}
		>{checked}</button
	>
	<button
		data-testid="sub-checked-binding"
		on:click={() => (subChecked = !subChecked)}>{subChecked}</button
	>
	<button
		aria-label="radio-main"
		data-testid="radio-binding"
		on:click={() => (radio = "")}>{radio}</button
	>
	<button
		aria-label="radio-sub"
		data-testid="sub-radio-binding"
		on:click={() => (subRadio = "")}>{subRadio}</button
	>
	<div id="portal-target" data-testid="portal-target" />
</main>
