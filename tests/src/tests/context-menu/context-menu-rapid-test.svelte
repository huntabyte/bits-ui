<script lang="ts">
	import { ContextMenu } from "bits-ui";
</script>

<div style="display: flex; flex-direction: column;">
	{#each { length: 30 } as _, i (i)}
		<ContextMenu.Root>
			<ContextMenu.Trigger data-testid="trigger-{i}" style="display: block; height: 24px;">
				Right click me {i}
			</ContextMenu.Trigger>
			<ContextMenu.Portal>
				<ContextMenu.Content
					data-testid="content-{i}"
					style="width: 200px; background: white;"
				>
					<ContextMenu.Item>{i}</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Portal>
		</ContextMenu.Root>
	{/each}
</div>
