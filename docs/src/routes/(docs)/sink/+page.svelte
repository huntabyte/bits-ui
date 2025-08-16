<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	let filters = $state<string[]>([]);
</script>

<div class="pt-8">
	{JSON.stringify(filters)}

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>open dropdown</DropdownMenu.Trigger>

		<DropdownMenu.Portal>
			<DropdownMenu.Content>
				<DropdownMenu.CheckboxGroup bind:value={filters}>
					{#each ["apple", "orange", "banana"] as fruit (fruit)}
						<DropdownMenu.CheckboxItem
							value={fruit}
							onCheckedChange={(checked) => {
								console.log(fruit, checked);
							}}
						>
							{#snippet children({ checked })}
								{fruit}
								{#if checked}✓{/if}
							{/snippet}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.CheckboxGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</div>
