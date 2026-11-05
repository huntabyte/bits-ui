<script lang="ts">
	import { Popover } from "bits-ui";

	let open = $state(false);
</script>

<main data-testid="main">
	<div data-testid="spacer-top" style="height: 720px;"></div>

	<div data-testid="anchor-zone" style="padding-left: 64px;">
		<Popover.Root bind:open>
			<Popover.Trigger data-testid="trigger">trigger</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					data-testid="content"
					preventScroll={false}
					side="bottom"
					sideOffset={8}
				>
					content
					<Popover.Close data-testid="close">close</Popover.Close>
					<Popover.Arrow data-testid="arrow" />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	</div>

	<div data-testid="spacer-bottom" style="height: 2000px;"></div>
	<div data-testid="open-binding">{open ? "true" : "false"}</div>
</main>
