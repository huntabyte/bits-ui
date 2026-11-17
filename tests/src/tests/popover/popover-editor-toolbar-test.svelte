<script lang="ts">
	import { Popover } from "bits-ui";
</script>

<main>
	<input data-testid="editor" />
	<Popover.Root>
		<Popover.Trigger data-testid="trigger" onmousedown={(e) => e.preventDefault()}>
			trigger
		</Popover.Trigger>
		<Popover.Content
			data-testid="content"
			trapFocus={false}
			onOpenAutoFocus={(e) => e.preventDefault()}
			onCloseAutoFocus={(e) => e.preventDefault()}
		>
			<button>inside</button>
		</Popover.Content>
	</Popover.Root>
</main>
