<script lang="ts">
	import * as Select from "@/primitives/select";
	import * as Menubar from "@/primitives/menubar";
	const fruits = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "blueberry", label: "Blueberry" },
		{ value: "grapes", label: "Grapes" },
		{ value: "pineapple", label: "Pineapple" }
	];
</script>

<div class="flex w-full p-8">
	<Select.Root>
		<Select.Trigger
			class="w-[180px] flex h-10 items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm  placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<Select.Value placeholder="Select a fruit" />
		</Select.Trigger>
		<Select.Content
			class="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-green-300 shadow-md"
		>
			<Select.Group>
				<Select.Label>Fruits</Select.Label>
				{#each fruits as fruit}
					<Select.Item
						value={fruit.value}
						label={fruit.label}
						class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
						>{fruit.label}</Select.Item
					>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="favoriteFruit" />
	</Select.Root>
</div>

<div>
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger class="trigger">File</Menubar.Trigger>
			<Menubar.Content class="menu">
				<Menubar.Item class="item">Single F</Menubar.Item>
				<Menubar.Item class="item">Double F</Menubar.Item>
				<Menubar.Item class="item">Triple F</Menubar.Item>
				<Menubar.Item class="item">Fourth F</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger class="menu">Edit</Menubar.Trigger>
			<Menubar.Content class="menu">
				<Menubar.Item class="item">Single E</Menubar.Item>
				<Menubar.Item class="item">Double E</Menubar.Item>
				<Menubar.Item class="item">Triple E</Menubar.Item>
				<Menubar.Item class="item">Fourth E</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger class="menu">View</Menubar.Trigger>
			<Menubar.Content class="menu">
				<Menubar.Item class="item">Single V</Menubar.Item>
				<Menubar.Item class="item">Double V</Menubar.Item>
				<Menubar.Item class="item">Triple V</Menubar.Item>
				<Menubar.Item class="item">Fourth V</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger class="menu">Help</Menubar.Trigger>
			<Menubar.Content class="menu">
				<Menubar.Item class="item">Single H</Menubar.Item>
				<Menubar.Item class="item">Double H</Menubar.Item>
				<Menubar.Item class="item">Triple H</Menubar.Item>
				<Menubar.Item class="item">Fourth H</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
</div>

<style lang="postcss">
	.menu {
		@apply z-10 flex max-h-[300px] min-w-[220px] flex-col shadow-lg shadow-neutral-900/30;
		@apply rounded-md bg-white p-1 lg:max-h-none;
		@apply ring-0 !important;
	}
	.subMenu {
		@apply min-w-[220px] shadow-md shadow-neutral-900/30;
	}
	.item {
		@apply relative h-6 min-h-[24px] select-none rounded-sm pl-6 pr-1;
		@apply z-20 text-green-900 outline-none;
		@apply data-[highlighted]:bg-green-200 data-[highlighted]:text-green-900;
		@apply data-[disabled]:text-neutral-300;
		@apply flex items-center text-sm leading-none;
		@apply cursor-default ring-0 !important;
	}

	.trigger {
		@apply inline-flex items-center justify-center rounded-md bg-white px-3 py-2;
		@apply text-green-900 transition-colors hover:bg-white/90 data-[highlighted]:outline-none;
		@apply overflow-visible data-[highlighted]:bg-green-200 data-[highlighted]:ring-green-400 !important;
		@apply !cursor-default text-sm font-medium leading-none focus:z-30 focus:ring;
	}
</style>
