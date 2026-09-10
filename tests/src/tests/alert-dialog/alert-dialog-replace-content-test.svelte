<script lang="ts">
	import { AlertDialog } from "bits-ui";

	let {
		version = 0,
		onOpenAutoFocus,
	}: {
		version?: number;
		onOpenAutoFocus: (event: Event) => void;
	} = $props();
</script>

<AlertDialog.Root open>
	<AlertDialog.Content {onOpenAutoFocus} trapFocus={false} preventScroll={false}>
		{#snippet child({ props })}
			{#key version}
				<div {...props} data-testid="content">
					<AlertDialog.Title>Confirm action</AlertDialog.Title>
					<AlertDialog.Description
						>This action needs confirmation.</AlertDialog.Description
					>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				</div>
			{/key}
		{/snippet}
	</AlertDialog.Content>
</AlertDialog.Root>
