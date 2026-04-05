<script lang="ts" module>
	export type RadioGroupScrollLayoutTestProps = {
		name?: string;
	};
</script>

<script lang="ts">
	import "../../app.css";
	import { RadioGroup } from "bits-ui";

	let { name }: RadioGroupScrollLayoutTestProps = $props();

	const rows = Array.from({ length: 120 }, (_, index) => index + 1);
	let value = $state("one");
</script>

<div data-testid="shell" style="height: 320px; overflow: hidden;">
	<div style="display: flex; height: 100%;">
		<aside
			data-testid="sidebar"
			style="width: 120px; flex-shrink: 0; overflow-y: auto; border-right: 1px solid black;"
		>
			{#each rows as row, i (i)}
				<div style="height: 24px;">Sidebar row {row}</div>
			{/each}
		</aside>
		<main data-testid="panel" style="min-width: 0; flex: 1; overflow-y: auto; padding: 12px;">
			{#each rows as row, i (i)}
				<div style="height: 24px;">Before row {row}</div>
			{/each}
			<RadioGroup.Root bind:value {name} orientation="horizontal" data-testid="root">
				<RadioGroup.Item value="one">One</RadioGroup.Item>
				<RadioGroup.Item value="two">Two</RadioGroup.Item>
			</RadioGroup.Root>
			{#each rows as row, i (i)}
				<div style="height: 24px;">After row {row}</div>
			{/each}
		</main>
	</div>
</div>
