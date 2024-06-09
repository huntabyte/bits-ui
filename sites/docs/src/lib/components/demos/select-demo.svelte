<script lang="ts">
	import { Select } from "bits-ui";
	import { CaretUpDown, Palette } from "$icons/index.js";

	const themes = [
		{ value: "light-monochrome", label: "Light Monochrome" },
		{ value: "dark-green", label: "Dark Green" },
		{ value: "svelte-orange", label: "Svelte Orange" },
		{ value: "punk-pink", label: "Punk Pink" },
	];
</script>

<div class="flex flex-col gap-4">
	<div>
		<Select.Root>
			<Select.Trigger
				class="inline-flex h-input w-[296px] items-center rounded-9px border border-border-input bg-background px-[11px] text-sm transition-colors placeholder:text-foreground-alt/50 "
				aria-label="Select a theme"
			>
				<Palette class="mr-[9px] size-6 text-muted-foreground" />
				<Select.Value class="text-sm" placeholder="Select a theme" />
				<CaretUpDown class="ml-auto size-6 text-muted-foreground" />
			</Select.Trigger>
			<Select.Content
				class="w-full min-w-[296px] rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-none"
				sideOffset={8}
				sameWidth={true}
			>
				<Select.Viewport>
					{#each themes as theme}
						<Select.Item
							class="focus-override flex h-10 w-full select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm outline-none transition-all duration-75 focus:outline-none focus-visible:outline-none data-[highlighted]:bg-muted"
							value={theme.value}
						>
							<Select.ItemText>
								{theme.label}
							</Select.ItemText>
						</Select.Item>
					{/each}
				</Select.Viewport>
			</Select.Content>
		</Select.Root>
	</div>
</div>
