<script lang="ts" context="module">
	export type ContextMenuTestProps = ContextMenu.Props & {
		checked?: boolean;
		subChecked?: boolean;
		radio?: string;
		subRadio?: string;
		open?: boolean;
	};
</script>

<script lang="ts">
	import { ContextMenu } from "$lib";

	export let checked = false;
	export let subChecked = false;
	export let radio = "";
	export let subRadio = "";
	export let open = false;
</script>

<main>
	<div data-testid="outside">outside</div>
	<div data-testid="non-portal-container">
		<ContextMenu.Root bind:open {...$$restProps}>
			<ContextMenu.Trigger
				data-testid="trigger"
				class="h-[500px] w-[500px]"
				aria-expanded={undefined}
				aria-controls={undefined}>open</ContextMenu.Trigger
			>
			<ContextMenu.Content data-testid="content">
				<ContextMenu.Separator data-testid="separator" />
				<ContextMenu.Group data-testid="group">
					<ContextMenu.Label data-testid="label">Stuff</ContextMenu.Label>
					<ContextMenu.Item data-testid="item">
						<span>item</span>
					</ContextMenu.Item>
				</ContextMenu.Group>

				<ContextMenu.Sub>
					<ContextMenu.SubTrigger data-testid="sub-trigger">
						<span>subtrigger</span>
					</ContextMenu.SubTrigger>
					<ContextMenu.SubContent data-testid="sub-content">
						<ContextMenu.Item data-testid="sub-item">
							<span>Email</span>
						</ContextMenu.Item>
						<ContextMenu.CheckboxItem
							bind:checked={subChecked}
							data-testid="sub-checkbox-item"
						>
							<ContextMenu.CheckboxIndicator
								data-testid="sub-checkbox-indicator"
							>
								checked
							</ContextMenu.CheckboxIndicator>
							sub checkbox
						</ContextMenu.CheckboxItem>
					</ContextMenu.SubContent>
				</ContextMenu.Sub>
				<ContextMenu.Item disabled data-testid="disabled-item"
					>disabled item</ContextMenu.Item
				>
				<ContextMenu.Item disabled data-testid="disabled-item-2"
					>disabled item 2</ContextMenu.Item
				>
				<ContextMenu.CheckboxItem bind:checked data-testid="checkbox-item">
					<ContextMenu.CheckboxIndicator data-testid="checkbox-indicator">
						checked
					</ContextMenu.CheckboxIndicator>
					Checkbox Item
				</ContextMenu.CheckboxItem>
				<ContextMenu.Item data-testid="item-2">item 2</ContextMenu.Item>
				<ContextMenu.RadioGroup bind:value={radio} data-testid="radio-group">
					<ContextMenu.RadioItem value="1" data-testid="radio-item">
						<ContextMenu.RadioIndicator>
							<span data-testid="radio-indicator-1"> checked </span>
						</ContextMenu.RadioIndicator>
						<span>Radio Item 1</span>
					</ContextMenu.RadioItem>
					<ContextMenu.RadioItem value="2" data-testid="radio-item-2">
						<ContextMenu.RadioIndicator>
							<span data-testid="radio-indicator-2"> checked </span>
						</ContextMenu.RadioIndicator>
						<span>Radio Item 2</span>
					</ContextMenu.RadioItem>
				</ContextMenu.RadioGroup>
			</ContextMenu.Content>
		</ContextMenu.Root>
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
