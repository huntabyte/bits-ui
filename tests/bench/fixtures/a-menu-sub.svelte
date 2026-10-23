<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	let { count, subOpen = false }: { count: number; subOpen?: boolean } = $props();
</script>

<DropdownMenu.Root open>
	<DropdownMenu.Trigger data-bench="trigger">open</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content data-bench="content">
			<DropdownMenu.Item>first</DropdownMenu.Item>
			<DropdownMenu.Sub bind:open={subOpen}>
				<DropdownMenu.SubTrigger data-bench="sub-trigger">sub</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent data-bench="sub-content">
					{#each { length: count }, i (i)}
						<DropdownMenu.Item data-bench="sub-item">Sub item {i}</DropdownMenu.Item>
					{/each}
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
