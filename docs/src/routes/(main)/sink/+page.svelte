<script lang="ts">
	import DemoContainer from "$lib/components/demo-container.svelte";
	import { Command } from "bits-ui";

	type Option = {
		value: number;
		label: string;
	};

	let items = $state<Option[]>([]);
	let searchTerm = $state("");
	let debounceTimer: number;

	async function fetchOptions(): Promise<Option[]> {
		return [
			{ label: "test1", value: 1 },
			{ label: "test2", value: 2 },
			{ label: "test3", value: 3 },
		];
	}

	async function handleSearch(value: string) {
		searchTerm = value;

		window.clearTimeout(debounceTimer);

		debounceTimer = window.setTimeout(async () => {
			items = await fetchOptions();
		}, 300);
	}
</script>

<div class="w-full max-w-[756px]">
	<DemoContainer>
		<Command.Root
			class="divide-border border-muted bg-background flex h-full w-full flex-col divide-y self-start overflow-hidden rounded-xl border"
		>
			<Command.Input
				class="focus-override h-input placeholder:text-foreground-alt/50 focus:outline-hidden bg-background inline-flex truncate rounded-tl-xl rounded-tr-xl px-4 text-sm transition-colors focus:ring-0"
				placeholder="Search for something..."
				oninput={(e) => {
					handleSearch(e.currentTarget.value.length > 0 ? e.currentTarget.value : "");
				}}
				value={searchTerm}
			/>
			<Command.List class="max-h-[280px] overflow-y-auto overflow-x-hidden px-2 pb-2">
				<Command.Viewport>
					<Command.Empty
						class="text-muted-foreground flex w-full items-center justify-center pb-6 pt-8 text-sm"
					>
						No results found.
					</Command.Empty>
					{JSON.stringify(items)}
					{#each items as item (item.value)}
						<Command.Item value={item.label}>{item.label}</Command.Item>
					{/each}
				</Command.Viewport>
			</Command.List>
		</Command.Root>
	</DemoContainer>
</div>
