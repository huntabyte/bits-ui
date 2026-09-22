<script lang="ts">
	import "../../app.css";
	import { Select } from "bits-ui";

	const items = Array.from({ length: 60 }, (_, i) => ({
		value: `${i}`,
		label: `Item ${i}`,
	}));

	let { value = $bindable("") }: { value?: string } = $props();
	let open = $state(false);
</script>

<main data-testid="main">
	<Select.Root bind:value bind:open type="single">
		<Select.Trigger data-testid="trigger">{value || "Open Listbox"}</Select.Trigger>
		<Select.Portal>
			<Select.Content
				data-testid="content"
				preventScroll={false}
				style={{ width: "220px", height: "200px", backgroundColor: "white" }}
			>
				<Select.Viewport data-testid="viewport">
					{#each items as item (item.value)}
						<Select.Item
							value={item.value}
							label={item.label}
							data-testid={`item-${item.value}`}
							style={{ height: "40px" }}
						>
							{item.label}
						</Select.Item>
					{/each}
				</Select.Viewport>
				<!-- chrome that takes its height only after the content is placed -->
				<div data-testid="footer" style="flex: none; height: 0px"></div>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
</main>
