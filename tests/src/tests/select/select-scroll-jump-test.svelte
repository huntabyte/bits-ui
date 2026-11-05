<script lang="ts">
	import "../../app.css";
	import { Select } from "bits-ui";

	const items = Array.from({ length: 120 }, (_, i) => ({
		value: `${i}`,
		label: `Item ${i}`,
	}));

	let value = $state("90");
	let open = $state(false);

	const selectedLabel = $derived(
		items.find((item) => item.value === value)?.label ?? "Open Listbox"
	);
</script>

<main data-testid="main">
	<div data-testid="spacer-top" style="height: 900px;"></div>

	<div data-testid="anchor-zone" style="padding-left: 64px;">
		<Select.Root bind:value bind:open type="single">
			<Select.Trigger data-testid="trigger">{selectedLabel}</Select.Trigger>
			<Select.Portal>
				<Select.Content
					data-testid="content"
					preventScroll={false}
					side="bottom"
					sideOffset={8}
					style={{ width: "220px", maxHeight: "220px", backgroundColor: "white" }}
				>
					<Select.Viewport data-testid="viewport">
						{#each items as item (item.value)}
							<Select.Item
								value={item.value}
								label={item.label}
								data-testid={`item-${item.value}`}
							>
								{item.label}
							</Select.Item>
						{/each}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	</div>

	<div data-testid="spacer-bottom" style="height: 2000px;"></div>
	<div data-testid="open-binding">{open ? "true" : "false"}</div>
</main>
