<script lang="ts">
	import { Popover } from "bits-ui";

	let { portalDisabled = false }: { portalDisabled?: boolean } = $props();
</script>

<div data-testid="scroller" style="position: relative; height: 100px; overflow-y: auto; margin-top: 200px;">
	<div style="height: 40px;"></div>
	<Popover.Root open>
		<Popover.Trigger data-testid="trigger">trigger</Popover.Trigger>
		<Popover.Portal disabled={portalDisabled}>
			<Popover.Content data-testid="content" hideWhenDetached preventScroll={false}>
				content
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
	<div style="height: 400px;"></div>
</div>
