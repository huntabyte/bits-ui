<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import Check from "phosphor-svelte/lib/Check";
	import FunnelSimple from "phosphor-svelte/lib/FunnelSimple";

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
		"border-muted bg-background shadow-popover outline-hidden focus-visible:outline-hidden w-[250px] rounded-xl border px-1 py-1.5";
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
			class="text-foreground-alt ml-auto size-4 shrink-0"
			viewBox="0 0 16 16"
			aria-hidden="true"
		>
			<circle cx="8" cy="8" r="4" fill="currentColor" />
		</svg>
	{/if}
{/snippet}

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="border-input text-foreground shadow-btn hover:bg-muted inline-flex h-10 select-none items-center justify-center rounded-full border px-4 text-sm font-medium active:scale-[0.98]"
	>
		<FunnelSimple class="size-5" />
		<span class="ml-1.5">Filter issue</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content class={contentClass} sideOffset={8}>
			<DropdownMenu.Item class={itemClass} disabled>Search issues…</DropdownMenu.Item>

			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger class={subTriggerClass}>
					Status
					<CaretRight class="text-foreground-alt ml-auto size-4" />
				</DropdownMenu.SubTrigger>
				<DropdownMenu.Portal>
					<DropdownMenu.SubContent class={subContentClass} sideOffset={10}>
						<DropdownMenu.RadioGroup bind:value={selectedStatus}>
							{#each statusItems as item (item.value)}
								<DropdownMenu.RadioItem value={item.value} class={itemClass}>
									{#snippet children({ checked })}
										{item.label}
										{@render radioCheckedIndicator(checked)}
									{/snippet}
								</DropdownMenu.RadioItem>
							{/each}
						</DropdownMenu.RadioGroup>
					</DropdownMenu.SubContent>
				</DropdownMenu.Portal>
			</DropdownMenu.Sub>

			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger class={subTriggerClass}>
					Issue properties
					<CaretRight class="text-foreground-alt ml-auto size-4" />
				</DropdownMenu.SubTrigger>
				<DropdownMenu.Portal>
					<DropdownMenu.SubContent class={subContentClass} sideOffset={10}>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class={subTriggerClass}>
								Priority
								<CaretRight class="text-foreground-alt ml-auto size-4" />
							</DropdownMenu.SubTrigger>
							<DropdownMenu.Portal>
								<DropdownMenu.SubContent class={subContentClass} sideOffset={10}>
									<DropdownMenu.RadioGroup bind:value={selectedPriority}>
										{#each priorityItems as item (item.value)}
											<DropdownMenu.RadioItem
												value={item.value}
												class={itemClass}
											>
												{#snippet children({ checked })}
													{item.label}
													{@render radioCheckedIndicator(checked)}
												{/snippet}
											</DropdownMenu.RadioItem>
										{/each}
									</DropdownMenu.RadioGroup>
								</DropdownMenu.SubContent>
							</DropdownMenu.Portal>
						</DropdownMenu.Sub>

						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class={subTriggerClass}>
								Type
								<CaretRight class="text-foreground-alt ml-auto size-4" />
							</DropdownMenu.SubTrigger>
							<DropdownMenu.Portal>
								<DropdownMenu.SubContent class={subContentClass} sideOffset={10}>
									<DropdownMenu.RadioGroup bind:value={selectedType}>
										{#each typeItems as item (item.value)}
											<DropdownMenu.RadioItem
												value={item.value}
												class={itemClass}
											>
												{#snippet children({ checked })}
													{item.label}
													{@render radioCheckedIndicator(checked)}
												{/snippet}
											</DropdownMenu.RadioItem>
										{/each}
									</DropdownMenu.RadioGroup>
								</DropdownMenu.SubContent>
							</DropdownMenu.Portal>
						</DropdownMenu.Sub>

						<DropdownMenu.Separator class="bg-muted -mx-1 my-1 block h-px" />

						<DropdownMenu.CheckboxGroup bind:value={digestPrefs}>
							<DropdownMenu.GroupHeading
								class="text-muted-foreground px-3 pb-2 pt-3 text-xs font-medium"
							>
								Email digest
							</DropdownMenu.GroupHeading>
							{#each digestItems as item (item.value)}
								<DropdownMenu.CheckboxItem value={item.value} class={itemClass}>
									{#snippet children({ checked })}
										<span>{item.label}</span>
										{#if checked}
											<Check
												class="text-foreground-alt ml-auto size-4 shrink-0"
											/>
										{/if}
									{/snippet}
								</DropdownMenu.CheckboxItem>
							{/each}
						</DropdownMenu.CheckboxGroup>

						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class={subTriggerClass}>
								Labels
								<CaretRight class="text-foreground-alt ml-auto size-4" />
							</DropdownMenu.SubTrigger>
							<DropdownMenu.Portal>
								<DropdownMenu.SubContent class={subContentClass} sideOffset={10}>
									<DropdownMenu.RadioGroup bind:value={selectedLabel}>
										{#each labelItems as item (item.value)}
											<DropdownMenu.RadioItem
												value={item.value}
												class={itemClass}
											>
												{#snippet children({ checked })}
													{item.label}
													{@render radioCheckedIndicator(checked)}
												{/snippet}
											</DropdownMenu.RadioItem>
										{/each}
									</DropdownMenu.RadioGroup>

									<DropdownMenu.Sub>
										<DropdownMenu.SubTrigger class={subTriggerClass}>
											Product area
											<CaretRight
												class="text-foreground-alt ml-auto size-4"
											/>
										</DropdownMenu.SubTrigger>
										<DropdownMenu.Portal>
											<DropdownMenu.SubContent
												class={subContentClass}
												sideOffset={10}
											>
												<DropdownMenu.Item class={itemClass}
													>Web app</DropdownMenu.Item
												>
												<DropdownMenu.Item class={itemClass}
													>Mobile</DropdownMenu.Item
												>
												<DropdownMenu.Item class={itemClass}
													>CLI</DropdownMenu.Item
												>
												<DropdownMenu.Item class={itemClass}
													>Marketing site</DropdownMenu.Item
												>
											</DropdownMenu.SubContent>
										</DropdownMenu.Portal>
									</DropdownMenu.Sub>
								</DropdownMenu.SubContent>
							</DropdownMenu.Portal>
						</DropdownMenu.Sub>
					</DropdownMenu.SubContent>
				</DropdownMenu.Portal>
			</DropdownMenu.Sub>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
