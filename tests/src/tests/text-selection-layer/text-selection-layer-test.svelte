<script lang="ts">
	import { Popover } from "bits-ui";
</script>

<main data-testid="main">
	<p data-testid="page-text">selectable page text</p>
	<Popover.Root>
		<Popover.Trigger data-testid="trigger">trigger</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content data-testid="content">
				<span data-testid="content-text">content text</span>
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
</main>
