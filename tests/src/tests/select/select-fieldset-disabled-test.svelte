<script lang="ts">
	import { Select } from "bits-ui";

	let { open = $bindable(false) } = $props();
</script>

<fieldset disabled>
	<Select.Root type="single" bind:open>
		<Select.Trigger data-testid="trigger">Open</Select.Trigger>
		<Select.Portal>
			<Select.Content data-testid="content">
				<Select.Item value="1" label="A">A</Select.Item>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
</fieldset>
<span data-testid="open-binding">{open}</span>
