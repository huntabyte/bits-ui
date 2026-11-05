<script lang="ts">
	import { Accordion, Slider } from "bits-ui";

	const items = ["1", "2", "3"] as const;
</script>

<Accordion.Root type="multiple" value={["1"]}>
	{#each items as item (item)}
		<Accordion.Item value={item}>
			<Accordion.Header>
				<Accordion.Trigger data-testid="{item}-trigger">Slider {item}</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content data-testid="{item}-content">
				<div style="padding: 8px 0;">
					<Slider.Root type="single" value={0} style="display: flex; width: 100px;">
						{#snippet children({ thumbItems })}
							<span
								style="position: relative; height: 8px; width: 100%; flex-grow: 1; overflow: hidden;"
							>
								<Slider.Range data-testid="range-{item}" />
							</span>
							{#each thumbItems as { index } (index)}
								<Slider.Thumb
									{index}
									data-testid="thumb-{item}"
									style="display: block; width: 20px; height: 20px;"
								/>
							{/each}
						{/snippet}
					</Slider.Root>
				</div>
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
