<script lang="ts">
	import { Popover } from "bits-ui";
</script>

<Popover.Root>
	<Popover.Trigger data-testid="trigger-1">trigger-1</Popover.Trigger>
	<Popover.Trigger data-testid="trigger-2">trigger-2</Popover.Trigger>
	<Popover.Trigger data-testid="trigger-3">trigger-3</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content data-testid="content">content</Popover.Content>
	</Popover.Portal>
</Popover.Root>
