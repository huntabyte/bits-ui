<script lang="ts">
	import { Popover } from "bits-ui";
</script>

<div style="height: 3000px; padding-top: 200px">
	<Popover.Root open>
		<Popover.Trigger data-bench="trigger">trigger</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content data-bench="content" strategy="fixed">
				<button>inside</button>
				<Popover.Arrow />
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
</div>
