<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	import "../../app.css";

	let { onInteractOutside }: { onInteractOutside: (event: PointerEvent) => void } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger data-testid="trigger">Actions</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content data-testid="content" {onInteractOutside}>
			<DropdownMenu.Item>Action</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
<!-- an outside control that owns its clicks, like a row or header cell with its own handler -->
<button
	data-testid="outside-stop"
	style="position: absolute; bottom: 0; right: 0"
	onclick={(e) => e.stopPropagation()}
>
	outside
</button>
