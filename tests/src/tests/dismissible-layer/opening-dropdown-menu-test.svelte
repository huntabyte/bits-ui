<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	import "../../app.css";

	let {
		onInteractOutside,
		onSelect,
	}: {
		onInteractOutside: (event: PointerEvent) => void;
		onSelect: () => void;
	} = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger data-testid="trigger">Actions</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content data-testid="content" {onInteractOutside}>
			<DropdownMenu.Item {onSelect}>Action</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
