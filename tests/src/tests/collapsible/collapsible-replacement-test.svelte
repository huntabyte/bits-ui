<script lang="ts">
	import { Collapsible } from "bits-ui";

	let revision = $state(0);
</script>

<Collapsible.Root open>
	<Collapsible.Content style="width: 120px; height: 40px">
		{#snippet child({ props })}
			{#key revision}
				<div {...props} data-testid="content">
					Content {revision}
				</div>
			{/key}
		{/snippet}
	</Collapsible.Content>
</Collapsible.Root>
<button data-testid="replace" onclick={() => revision++}>Replace content</button>
