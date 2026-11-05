<script lang="ts">
	import { ContextMenu } from "bits-ui";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import Check from "phosphor-svelte/lib/Check";
	import MouseSimple from "phosphor-svelte/lib/MouseSimple";

	let selectedStatus = $state("in-progress");
	let selectedPriority = $state("p2");
	let selectedType = $state("feature");
	let selectedLabel = $state("customer-facing");
	let digestPrefs = $state<string[]>(["assignee", "mentions"]);

	const statusItems = [
		{ value: "icebox", label: "Icebox" },
		{ value: "backlog", label: "Backlog" },
		{ value: "todo", label: "Todo" },
		{ value: "in-progress", label: "In progress" },
		{ value: "done", label: "Done" },
	] as const;

	const priorityItems = [
		{ value: "p0", label: "P0 - Critical" },
		{ value: "p1", label: "P1 - High" },
		{ value: "p2", label: "P2 - Medium" },
		{ value: "p3", label: "P3 - Low" },
	] as const;

	const typeItems = [
		{ value: "bug", label: "Bug" },
		{ value: "feature", label: "Feature" },
		{ value: "improvement", label: "Improvement" },
		{ value: "docs", label: "Docs" },
	] as const;

	const labelItems = [
		{ value: "customer-facing", label: "Customer-facing" },
		{ value: "internal-tooling", label: "Internal tooling" },
		{ value: "technical-debt", label: "Technical debt" },
		{ value: "compliance", label: "Compliance" },
		{ value: "platform", label: "Platform" },
	] as const;

	const digestItems = [
		{ value: "assignee", label: "Assignee changes" },
		{ value: "comments", label: "New comments" },
		{ value: "mentions", label: "@mentions" },
	] as const;

	const contentClass =
		"z-50 border-muted bg-background shadow-popover outline-hidden focus-visible:outline-hidden w-[250px] rounded-xl border px-1 py-1.5";
	const subContentClass =
		"border-muted bg-background shadow-popover outline-hidden focus-visible:outline-hidden z-100 w-[230px] rounded-xl border px-1 py-1.5";
	const itemClass =
		"rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none";
	const subTriggerClass =
		"rounded-button data-highlighted:bg-muted data-[state=open]:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none";
</script>

{#snippet radioCheckedIndicator(checked: boolean)}
	{#if checked}
		<svg
			class="ml-auto size-4 shrink-0 text-foreground-alt"
			viewBox="0 0 16 16"
			aria-hidden="true"
		>
			<circle cx="8" cy="8" r="4" fill="currentColor" />
		</svg>
	{/if}
{/snippet}

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="flex h-[220px] w-full max-w-[320px] items-center justify-center rounded-card border-2 border-dashed border-border-input bg-transparent text-sm font-semibold text-muted-foreground select-none"
	>
		<div class="flex flex-col items-center justify-center gap-3 text-center">
			<MouseSimple class="size-8" />
			<span>Right-click this issue card</span>
		</div>
	</ContextMenu.Trigger>
	<ContextMenu.Portal>
		<ContextMenu.Content class={contentClass} sideOffset={8}>
			<ContextMenu.Item class={itemClass} disabled>Search issues…</ContextMenu.Item>

			<ContextMenu.Sub>
				<ContextMenu.SubTrigger class={subTriggerClass}>
					Status
					<CaretRight class="ml-auto size-4 text-foreground-alt" />
				</ContextMenu.SubTrigger>
				<ContextMenu.Portal>
					<ContextMenu.SubContent class={subContentClass} sideOffset={10}>
						<ContextMenu.RadioGroup bind:value={selectedStatus}>
							{#each statusItems as item (item.value)}
								<ContextMenu.RadioItem value={item.value} class={itemClass}>
									{#snippet children({ checked })}
										{item.label}
										{@render radioCheckedIndicator(checked)}
									{/snippet}
								</ContextMenu.RadioItem>
							{/each}
						</ContextMenu.RadioGroup>
					</ContextMenu.SubContent>
				</ContextMenu.Portal>
			</ContextMenu.Sub>

			<ContextMenu.Sub>
				<ContextMenu.SubTrigger class={subTriggerClass}>
					Issue properties
					<CaretRight class="ml-auto size-4 text-foreground-alt" />
				</ContextMenu.SubTrigger>
				<ContextMenu.Portal>
					<ContextMenu.SubContent class={subContentClass} sideOffset={10}>
						<ContextMenu.Sub>
							<ContextMenu.SubTrigger class={subTriggerClass}>
								Priority
								<CaretRight class="ml-auto size-4 text-foreground-alt" />
							</ContextMenu.SubTrigger>
							<ContextMenu.Portal>
								<ContextMenu.SubContent class={subContentClass} sideOffset={10}>
									<ContextMenu.RadioGroup bind:value={selectedPriority}>
										{#each priorityItems as item (item.value)}
											<ContextMenu.RadioItem
												value={item.value}
												class={itemClass}
											>
												{#snippet children({ checked })}
													{item.label}
													{@render radioCheckedIndicator(checked)}
												{/snippet}
											</ContextMenu.RadioItem>
										{/each}
									</ContextMenu.RadioGroup>
								</ContextMenu.SubContent>
							</ContextMenu.Portal>
						</ContextMenu.Sub>

						<ContextMenu.Sub>
							<ContextMenu.SubTrigger class={subTriggerClass}>
								Type
								<CaretRight class="ml-auto size-4 text-foreground-alt" />
							</ContextMenu.SubTrigger>
							<ContextMenu.Portal>
								<ContextMenu.SubContent class={subContentClass} sideOffset={10}>
									<ContextMenu.RadioGroup bind:value={selectedType}>
										{#each typeItems as item (item.value)}
											<ContextMenu.RadioItem
												value={item.value}
												class={itemClass}
											>
												{#snippet children({ checked })}
													{item.label}
													{@render radioCheckedIndicator(checked)}
												{/snippet}
											</ContextMenu.RadioItem>
										{/each}
									</ContextMenu.RadioGroup>
								</ContextMenu.SubContent>
							</ContextMenu.Portal>
						</ContextMenu.Sub>

						<ContextMenu.Separator class="-mx-1 my-1 block h-px bg-muted" />

						<ContextMenu.CheckboxGroup bind:value={digestPrefs}>
							<ContextMenu.GroupHeading
								class="px-3 pt-3 pb-2 text-xs font-medium text-muted-foreground"
							>
								Email digest
							</ContextMenu.GroupHeading>
							{#each digestItems as item (item.value)}
								<ContextMenu.CheckboxItem value={item.value} class={itemClass}>
									{#snippet children({ checked })}
										<span>{item.label}</span>
										{#if checked}
											<Check
												class="ml-auto size-4 shrink-0 text-foreground-alt"
											/>
										{/if}
									{/snippet}
								</ContextMenu.CheckboxItem>
							{/each}
						</ContextMenu.CheckboxGroup>

						<ContextMenu.Sub>
							<ContextMenu.SubTrigger class={subTriggerClass}>
								Labels
								<CaretRight class="ml-auto size-4 text-foreground-alt" />
							</ContextMenu.SubTrigger>
							<ContextMenu.Portal>
								<ContextMenu.SubContent class={subContentClass} sideOffset={10}>
									<ContextMenu.RadioGroup bind:value={selectedLabel}>
										{#each labelItems as item (item.value)}
											<ContextMenu.RadioItem
												value={item.value}
												class={itemClass}
											>
												{#snippet children({ checked })}
													{item.label}
													{@render radioCheckedIndicator(checked)}
												{/snippet}
											</ContextMenu.RadioItem>
										{/each}
									</ContextMenu.RadioGroup>

									<ContextMenu.Sub>
										<ContextMenu.SubTrigger class={subTriggerClass}>
											Product area
											<CaretRight
												class="ml-auto size-4 text-foreground-alt"
											/>
										</ContextMenu.SubTrigger>
										<ContextMenu.Portal>
											<ContextMenu.SubContent
												class={subContentClass}
												sideOffset={10}
											>
												<ContextMenu.Item class={itemClass}
													>Web app</ContextMenu.Item
												>
												<ContextMenu.Item class={itemClass}
													>Mobile</ContextMenu.Item
												>
												<ContextMenu.Item class={itemClass}
													>CLI</ContextMenu.Item
												>
												<ContextMenu.Item class={itemClass}
													>Marketing site</ContextMenu.Item
												>
											</ContextMenu.SubContent>
										</ContextMenu.Portal>
									</ContextMenu.Sub>
								</ContextMenu.SubContent>
							</ContextMenu.Portal>
						</ContextMenu.Sub>
					</ContextMenu.SubContent>
				</ContextMenu.Portal>
			</ContextMenu.Sub>
		</ContextMenu.Content>
	</ContextMenu.Portal>
</ContextMenu.Root>
