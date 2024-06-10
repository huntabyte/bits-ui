<script lang="ts" context="module">
	import { Select } from "$lib/index.js";
	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type SelectTestProps = Select.RootProps & {
		options: Item[];
		placeholder?: string;
		portalProps?: Select.PortalProps;
		contentProps?: Omit<Select.ContentProps, "children" | "asChild" | "child">;
	};
</script>

<script lang="ts">
	let {
		value = "",
		open = false,
		placeholder = "select something",
		options = [],
		portalProps = {},
		contentProps = {},
		...restProps
	}: SelectTestProps = $props();
</script>

<main data-testid="main">
	<form data-testid="form">
		<Select.Root bind:value bind:open {...restProps}>
			<Select.Trigger data-testid="trigger" aria-label="open select">
				<Select.Value data-testid="value" {placeholder} />
			</Select.Trigger>
			<Select.Portal {...portalProps}>
				<Select.Content data-testid="content" {...contentProps}>
					<Select.ScrollUpButton data-testid="scroll-up-button" />
					<Select.Viewport data-testid="viewport">
						<Select.Separator data-testid="separator" />
						<Select.Group data-testid="group">
							<Select.GroupLabel data-testid="group-label">Options</Select.GroupLabel>
							{#each options as { value, label, disabled }}
								<Select.Item data-testid={value} {disabled} {value}>
									{#snippet children({ selected })}
										{#if selected}
											<span data-testid="{value}-indicator">x</span>
										{/if}
										<Select.ItemText data-testid="{value}-item-text">
											{label}
										</Select.ItemText>
									{/snippet}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Viewport>
					<Select.ScrollDownButton data-testid="scroll-down-button" />
				</Select.Content>
			</Select.Portal>
		</Select.Root>
		<div data-testid="outside"></div>
		<button type="button" data-testid="open-binding" onclick={() => (open = !open)}>
			{open}
		</button>
		<button
			type="button"
			data-testid="value-binding"
			aria-label="value binding"
			onclick={() => (value = "")}
		>
			{value}
		</button>
	</form>
</main>
<div data-testid="portal-target" id="portal-target"></div>
