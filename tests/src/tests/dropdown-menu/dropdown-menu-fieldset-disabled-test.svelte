<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	let { open = $bindable(false) } = $props();
</script>

<fieldset disabled>
	<DropdownMenu.Root bind:open>
		<DropdownMenu.Trigger data-testid="trigger">Open</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownMenu.Content data-testid="content">
				<DropdownMenu.Item>A</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</fieldset>
<span data-testid="open-binding">{open}</span>
