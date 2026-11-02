<script lang="ts" module>
	import { Combobox, type ComboboxSingleRootProps, type WithoutChildren } from "bits-ui";

	export type ComboboxTriggerInputTestProps = Omit<
		WithoutChildren<ComboboxSingleRootProps>,
		"type"
	>;
</script>

<script lang="ts">
	let { open = false, ...restProps }: ComboboxTriggerInputTestProps = $props();
</script>

<main>
	<Combobox.Root type="single" bind:open {...restProps}>
		<Combobox.Trigger>
			{#snippet child({ props })}
				<div {...props} data-testid="trigger">
					<label for="trigger-input" data-testid="label">Fruit</label>
					<Combobox.Input id="trigger-input" data-testid="input" />
				</div>
			{/snippet}
		</Combobox.Trigger>
		<Combobox.Portal>
			<Combobox.Content data-testid="content">
				<Combobox.Item value="1" label="A">A</Combobox.Item>
				<Combobox.Item value="2" label="B">B</Combobox.Item>
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
	<button data-testid="outside">outside</button>
</main>
