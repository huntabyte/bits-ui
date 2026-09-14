<script lang="ts" module>
	import { Tabs, type WithoutChildrenOrChild } from "bits-ui";
	export type Item = {
		value: string;
		disabled: boolean;
	};

	export type TabsTestProps = WithoutChildrenOrChild<Tabs.RootProps> & {
		items: Item[];
		contentTabindex?: number;
		contentLayout?: "text" | "button" | "text-button";
	};
</script>

<script lang="ts">
	let {
		value = "1",
		items,
		contentTabindex,
		contentLayout = "text",
		...restProps
	}: TabsTestProps = $props();
</script>

<main>
	<Tabs.Root aria-label="airplane mode" data-testid="root" bind:value {...restProps}>
		<Tabs.List data-testid="list">
			{#each items as { value, disabled } (value)}
				<Tabs.Trigger {value} {disabled} data-testid="trigger-{value}">
					{value}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		{#each items as { value } (value)}
			<Tabs.Content {value} tabindex={contentTabindex} data-testid="content-{value}">
				{#if contentLayout !== "button"}
					<p>{value}</p>
				{/if}
				{#if contentLayout !== "text"}
					<button tabindex="0" data-testid="content-button-{value}">Action</button>
				{/if}
			</Tabs.Content>
		{/each}
	</Tabs.Root>
	<button data-testid="binding" onclick={() => (value = "1")}>{value}</button>
</main>
