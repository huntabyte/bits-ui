<script lang="ts">
	import "../../app.css";
	import { Select } from "bits-ui";

	const items = Array.from({ length: 60 }, (_, i) => ({
		value: `${i}`,
		label: `Item ${i}`,
	}));

	let {
		value = $bindable(""),
		overlayScrollButtons = false,
	}: { value?: string; overlayScrollButtons?: boolean } = $props();
	let open = $state(false);

	const buttonStyle = { height: "20px", backgroundColor: "white" } as const;
	// overlaid scroll buttons are outside the flex flow, so mounting and unmounting
	// them leaves the viewport's own scroll geometry alone
	const overlayStyle = { position: "absolute", left: "0", right: "0" } as const;

	const upStyle = $derived(
		overlayScrollButtons ? { ...buttonStyle, ...overlayStyle, top: "0" } : buttonStyle
	);
	const downStyle = $derived(
		overlayScrollButtons ? { ...buttonStyle, ...overlayStyle, bottom: "0" } : buttonStyle
	);
</script>

<main data-testid="main">
	<Select.Root bind:value bind:open type="single">
		<Select.Trigger data-testid="trigger">{value || "Open Listbox"}</Select.Trigger>
		<Select.Portal>
			<Select.Content
				data-testid="content"
				preventScroll={false}
				style={{
					width: "220px",
					height: "200px",
					position: "relative",
					backgroundColor: "white",
				}}
			>
				<Select.ScrollUpButton data-testid="scroll-up-button" style={upStyle}>
					up
				</Select.ScrollUpButton>
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
				<Select.ScrollDownButton data-testid="scroll-down-button" style={downStyle}>
					down
				</Select.ScrollDownButton>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
</main>
