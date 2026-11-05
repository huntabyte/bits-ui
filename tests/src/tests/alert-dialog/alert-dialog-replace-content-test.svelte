<script lang="ts">
	import { AlertDialog } from "bits-ui";

	let { onOpenAutoFocus }: { onOpenAutoFocus: (e: Event) => void } = $props();

	let version = $state(0);
</script>

<AlertDialog.Root open>
	<AlertDialog.Content
		onOpenAutoFocus={(e) => {
			onOpenAutoFocus(e);
			// replace the content node before the delayed autofocus runs
			if (version === 0) version = 1;
			else e.preventDefault();
		}}
	>
		{#snippet child({ props })}
			{#key version}
				<div {...props} data-testid="content" data-version={version}>
					<AlertDialog.Title>Confirm action</AlertDialog.Title>
					<AlertDialog.Description
						>This action needs confirmation.</AlertDialog.Description
					>
				</div>
			{/key}
		{/snippet}
	</AlertDialog.Content>
</AlertDialog.Root>
