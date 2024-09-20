<script lang="ts" module>
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
		onSubmit?: (value: string) => void;
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
		name = "theme",
		onSubmit,
		...restProps
	}: SelectTestProps = $props();
</script>

<main data-testid="main" class="relative">
	<form
		data-testid="form"
		onsubmit={(e) => {
			e.preventDefault();
			const fd = new FormData(e.currentTarget);
			onSubmit?.(String(fd.get(name)));
		}}
	>
		<Select.Root bind:value bind:open {...restProps} {name}>
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
		<div data-testid="outside" class="absolute left-0 top-0 size-10"></div>
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

		<button data-testid="submit"> submit </button>
	</form>
</main>
<div data-testid="portal-target" id="portal-target"></div>
