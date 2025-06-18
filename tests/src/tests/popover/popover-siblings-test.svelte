<script lang="ts">
	import { Popover } from "bits-ui";
</script>

<Popover.Root>
	<Popover.Trigger data-testid="open-1">open-1</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content data-testid="content-1">
			content-1
			<Popover.Close data-testid="close-1">close-1</Popover.Close>
			<Popover.Arrow />
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>

<Popover.Root>
	<Popover.Trigger data-testid="open-2">open-2</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content data-testid="content-2">
			content-2
			<Popover.Close data-testid="close-2">close-2</Popover.Close>
			<Popover.Arrow />
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>

<Popover.Root>
	<Popover.Trigger data-testid="open-3">open-3</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content data-testid="content-3">
			content-3
			<Popover.Close data-testid="close-3">close-3</Popover.Close>
			<Popover.Arrow />
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
