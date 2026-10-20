<script lang="ts" module>
	import { Select, type SelectSingleRootProps, type WithoutChildren } from "bits-ui";

	export type SelectChildTriggerTestProps = Omit<WithoutChildren<SelectSingleRootProps>, "type">;
</script>

<script lang="ts">
	let { open = false, ...restProps }: SelectChildTriggerTestProps = $props();
</script>

<main>
	<Select.Root type="single" bind:open {...restProps}>
		<Select.Trigger>
			{#snippet child({ props })}
				<div {...props} tabindex="0" data-testid="trigger">Open</div>
			{/snippet}
		</Select.Trigger>
		<Select.Portal>
			<Select.Content data-testid="content">
				<Select.Item value="1" label="A">A</Select.Item>
				<Select.Item value="2" label="B">B</Select.Item>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
	<button data-testid="outside">outside</button>
</main>
