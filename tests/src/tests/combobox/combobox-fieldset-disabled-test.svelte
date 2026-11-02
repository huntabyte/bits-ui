<script lang="ts">
	import { Combobox } from "bits-ui";

	let { open = $bindable(false) } = $props();
</script>

<fieldset disabled>
	<Combobox.Root type="single" bind:open>
		<Combobox.Input data-testid="input" />
		<Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
		<Combobox.Portal>
			<Combobox.Content data-testid="content">
				<Combobox.Item value="1" label="A">A</Combobox.Item>
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
</fieldset>
<span data-testid="open-binding">{open}</span>
