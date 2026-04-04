<script lang="ts">
	import { ContextMenu, DropdownMenu } from "bits-ui";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import DotsThree from "phosphor-svelte/lib/DotsThree";
	import FunnelSimple from "phosphor-svelte/lib/FunnelSimple";
	import MouseSimple from "phosphor-svelte/lib/MouseSimple";

	let debugMode = $state(true);
	let openDelay = $state(80);
	let contentSideOffset = $state(10);
	let contentAlignOffset = $state(0);
	let subContentSideOffset = $state(10);
	let subContentAlignOffset = $state(0);
	let selectedStatus = $state("icebox");
	let selectedPriority = $state("p1");
	let selectedLabel = $state("strategic-initiative");
	let selectedLead = $state("hunter");
	const debugRootProps = $derived.by(() => ({ debugMode }) satisfies { debugMode: boolean });

	const statusItems = [
		{ value: "icebox", label: "Icebox" },
		{ value: "backlog", label: "Backlog" },
		{ value: "todo", label: "Todo" },
		{ value: "in-progress", label: "In Progress" },
		{ value: "done", label: "Done" },
	];

	const priorityItems = [
		{ value: "p0", label: "P0 - Critical" },
		{ value: "p1", label: "P1 - High" },
		{ value: "p2", label: "P2 - Medium" },
		{ value: "p3", label: "P3 - Low" },
	];

	const labelItems = [
		{ value: "strategic-initiative", label: "Strategic Initiative" },
		{ value: "customer-facing", label: "Customer Facing" },
		{ value: "internal-tooling", label: "Internal Tooling" },
		{ value: "technical-debt", label: "Technical Debt" },
		{ value: "revenue-impact", label: "Revenue Impact" },
		{ value: "cost-reduction", label: "Cost Reduction" },
		{ value: "compliance", label: "Compliance" },
		{ value: "platform", label: "Platform" },
		{ value: "infrastructure", label: "Infrastructure" },
		{ value: "growth", label: "Growth" },
	];

	const leadItems = [
		{ value: "hunter", label: "@huntabyte" },
		{ value: "pavel", label: "@pavel_stianko" },
		{ value: "adrian", label: "@cokakoala_" },
		{ value: "thomas", label: "@thomasglopes" },
	];

	const triggerClass =
		"border-input text-foreground shadow-btn hover:bg-muted inline-flex h-10 select-none items-center justify-center rounded-full border px-4 text-sm font-medium active:scale-[0.98]";
	const contentClass =
		"border-muted bg-background shadow-popover outline-hidden focus-visible:outline-hidden w-[250px] rounded-xl border px-1 py-1.5";
	const subContentClass =
		"border-muted bg-background shadow-popover outline-hidden focus-visible:outline-hidden z-100 w-[230px] rounded-xl border px-1 py-1.5";
	const itemClass =
		"rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none";
	const subTriggerClass =
		"rounded-button data-highlighted:bg-muted data-[state=open]:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none";
</script>

<div class="mx-auto flex w-full max-w-[980px] flex-col gap-6 p-6">
	<div class="border-muted bg-background shadow-popover rounded-xl border p-4">
		<div class="mb-4 flex items-center justify-between gap-3">
			<div>
				<p class="text-foreground text-sm font-semibold">submenu intent sandbox</p>
				<p class="text-muted-foreground text-xs">
					Use this page to stress nested submenu transitions and safe-area debug overlays.
				</p>
			</div>
			<div
				class="text-muted-foreground rounded-button bg-muted px-2.5 py-1.5 text-xs font-medium"
			>
				depth: 4 levels
			</div>
		</div>

		<div class="grid gap-3 md:grid-cols-2">
			<label
				class="border-input rounded-button flex items-center gap-3 border px-3 py-2 text-sm"
			>
				<input type="checkbox" bind:checked={debugMode} class="size-4" />
				<span class="font-medium">debugMode</span>
				<span class="text-muted-foreground ml-auto text-xs">{debugMode ? "on" : "off"}</span
				>
			</label>

			<label
				class="border-input rounded-button flex items-center gap-3 border px-3 py-2 text-sm"
			>
				<span class="font-medium">openDelay</span>
				<input
					type="range"
					min={0}
					max={400}
					step={20}
					bind:value={openDelay}
					class="w-full"
				/>
				<span class="text-muted-foreground min-w-[55px] text-right text-xs"
					>{openDelay}ms</span
				>
			</label>

			<div class="border-input rounded-button flex flex-col gap-2 border px-3 py-2 text-sm">
				<p class="font-medium">content offsets</p>
				<label class="flex items-center gap-3 text-xs">
					<span class="min-w-[68px] font-medium">sideOffset</span>
					<input
						type="range"
						min={-30}
						max={30}
						step={1}
						bind:value={contentSideOffset}
						class="w-full"
					/>
					<span class="text-muted-foreground min-w-[30px] text-right"
						>{contentSideOffset}</span
					>
				</label>
				<label class="flex items-center gap-3 text-xs">
					<span class="min-w-[68px] font-medium">alignOffset</span>
					<input
						type="range"
						min={-30}
						max={30}
						step={1}
						bind:value={contentAlignOffset}
						class="w-full"
					/>
					<span class="text-muted-foreground min-w-[30px] text-right"
						>{contentAlignOffset}</span
					>
				</label>
			</div>

			<div class="border-input rounded-button flex flex-col gap-2 border px-3 py-2 text-sm">
				<p class="font-medium">subcontent offsets</p>
				<label class="flex items-center gap-3 text-xs">
					<span class="min-w-[68px] font-medium">sideOffset</span>
					<input
						type="range"
						min={-30}
						max={30}
						step={1}
						bind:value={subContentSideOffset}
						class="w-full"
					/>
					<span class="text-muted-foreground min-w-[30px] text-right"
						>{subContentSideOffset}</span
					>
				</label>
				<label class="flex items-center gap-3 text-xs">
					<span class="min-w-[68px] font-medium">alignOffset</span>
					<input
						type="range"
						min={-30}
						max={30}
						step={1}
						bind:value={subContentAlignOffset}
						class="w-full"
					/>
					<span class="text-muted-foreground min-w-[30px] text-right"
						>{subContentAlignOffset}</span
					>
				</label>
			</div>
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		<section class="border-muted bg-background rounded-xl border p-5">
			<div class="mb-4 flex items-center gap-2">
				<FunnelSimple class="text-foreground-alt size-5" />
				<h2 class="text-sm font-semibold">dropdown stress test</h2>
			</div>

			<DropdownMenu.Root {...debugRootProps}>
				<DropdownMenu.Trigger class={triggerClass}>
					<DotsThree class="size-5" />
					<span class="ml-1.5">Filter</span>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content
						class={contentClass}
						sideOffset={contentSideOffset}
						alignOffset={contentAlignOffset}
					>
						<DropdownMenu.Item class={itemClass} disabled
							>Search all...</DropdownMenu.Item
						>

						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class={subTriggerClass} {openDelay}>
								Status
								<CaretRight class="text-foreground-alt ml-auto size-4" />
							</DropdownMenu.SubTrigger>
							<DropdownMenu.Portal>
								<DropdownMenu.SubContent
									class={subContentClass}
									sideOffset={subContentSideOffset}
									alignOffset={subContentAlignOffset}
								>
									<DropdownMenu.RadioGroup bind:value={selectedStatus}>
										{#each statusItems as item (item.value)}
											<DropdownMenu.RadioItem
												value={item.value}
												class={itemClass}
											>
												{#snippet children({ checked })}
													{item.label}
													{#if checked}
														<span class="ml-auto text-xs">selected</span
														>
													{/if}
												{/snippet}
											</DropdownMenu.RadioItem>
										{/each}
									</DropdownMenu.RadioGroup>
								</DropdownMenu.SubContent>
							</DropdownMenu.Portal>
						</DropdownMenu.Sub>

						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger class={subTriggerClass} {openDelay}>
								Project properties
								<CaretRight class="text-foreground-alt ml-auto size-4" />
							</DropdownMenu.SubTrigger>
							<DropdownMenu.Portal>
								<DropdownMenu.SubContent
									class={subContentClass}
									sideOffset={subContentSideOffset}
									alignOffset={subContentAlignOffset}
								>
									<DropdownMenu.Item class={itemClass}
										>Project status</DropdownMenu.Item
									>
									<DropdownMenu.Item class={itemClass}
										>Project status type</DropdownMenu.Item
									>

									<DropdownMenu.Sub>
										<DropdownMenu.SubTrigger
											class={subTriggerClass}
											{openDelay}
										>
											Project priority
											<CaretRight
												class="text-foreground-alt ml-auto size-4"
											/>
										</DropdownMenu.SubTrigger>
										<DropdownMenu.Portal>
											<DropdownMenu.SubContent
												class={subContentClass}
												sideOffset={subContentSideOffset}
												alignOffset={subContentAlignOffset}
											>
												<DropdownMenu.RadioGroup
													bind:value={selectedPriority}
												>
													{#each priorityItems as item (item.value)}
														<DropdownMenu.RadioItem
															value={item.value}
															class={itemClass}
														>
															{#snippet children({ checked })}
																{item.label}
																{#if checked}
																	<span class="ml-auto text-xs"
																		>selected</span
																	>
																{/if}
															{/snippet}
														</DropdownMenu.RadioItem>
													{/each}
												</DropdownMenu.RadioGroup>
											</DropdownMenu.SubContent>
										</DropdownMenu.Portal>
									</DropdownMenu.Sub>

									<DropdownMenu.Sub>
										<DropdownMenu.SubTrigger
											class={subTriggerClass}
											{openDelay}
										>
											Project labels
											<CaretRight
												class="text-foreground-alt ml-auto size-4"
											/>
										</DropdownMenu.SubTrigger>
										<DropdownMenu.Portal>
											<DropdownMenu.SubContent
												class={subContentClass}
												sideOffset={subContentSideOffset}
												alignOffset={subContentAlignOffset}
											>
												<DropdownMenu.RadioGroup bind:value={selectedLabel}>
													{#each labelItems as item (item.value)}
														<DropdownMenu.RadioItem
															value={item.value}
															class={itemClass}
														>
															{#snippet children({ checked })}
																{item.label}
																{#if checked}
																	<span class="ml-auto text-xs"
																		>selected</span
																	>
																{/if}
															{/snippet}
														</DropdownMenu.RadioItem>
													{/each}
												</DropdownMenu.RadioGroup>

												<DropdownMenu.Sub>
													<DropdownMenu.SubTrigger
														class={subTriggerClass}
														{openDelay}
													>
														Infrastructure...
														<CaretRight
															class="text-foreground-alt ml-auto size-4"
														/>
													</DropdownMenu.SubTrigger>
													<DropdownMenu.Portal>
														<DropdownMenu.SubContent
															class={subContentClass}
															sideOffset={subContentSideOffset}
															alignOffset={subContentAlignOffset}
														>
															<DropdownMenu.Item class={itemClass}
																>Kubernetes</DropdownMenu.Item
															>
															<DropdownMenu.Item class={itemClass}
																>Database</DropdownMenu.Item
															>
															<DropdownMenu.Item class={itemClass}
																>CI Pipeline</DropdownMenu.Item
															>
															<DropdownMenu.Item class={itemClass}
																>Observability</DropdownMenu.Item
															>
														</DropdownMenu.SubContent>
													</DropdownMenu.Portal>
												</DropdownMenu.Sub>
											</DropdownMenu.SubContent>
										</DropdownMenu.Portal>
									</DropdownMenu.Sub>

									<DropdownMenu.Sub>
										<DropdownMenu.SubTrigger
											class={subTriggerClass}
											{openDelay}
										>
											Project lead
											<CaretRight
												class="text-foreground-alt ml-auto size-4"
											/>
										</DropdownMenu.SubTrigger>
										<DropdownMenu.Portal>
											<DropdownMenu.SubContent
												class={subContentClass}
												sideOffset={subContentSideOffset}
												alignOffset={subContentAlignOffset}
											>
												<DropdownMenu.RadioGroup bind:value={selectedLead}>
													{#each leadItems as item (item.value)}
														<DropdownMenu.RadioItem
															value={item.value}
															class={itemClass}
														>
															{#snippet children({ checked })}
																{item.label}
																{#if checked}
																	<span class="ml-auto text-xs"
																		>selected</span
																	>
																{/if}
															{/snippet}
														</DropdownMenu.RadioItem>
													{/each}
												</DropdownMenu.RadioGroup>
											</DropdownMenu.SubContent>
										</DropdownMenu.Portal>
									</DropdownMenu.Sub>
								</DropdownMenu.SubContent>
							</DropdownMenu.Portal>
						</DropdownMenu.Sub>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</section>

		<section class="border-muted bg-background rounded-xl border p-5">
			<div class="mb-4 flex items-center gap-2">
				<MouseSimple class="text-foreground-alt size-5" />
				<h2 class="text-sm font-semibold">context-menu stress test</h2>
			</div>

			<ContextMenu.Root {...debugRootProps}>
				<ContextMenu.Trigger
					class="rounded-card border-input text-muted-foreground flex h-[220px] w-full select-none items-center justify-center border-2 border-dashed bg-transparent text-sm font-semibold"
				>
					right click in this panel
				</ContextMenu.Trigger>
				<ContextMenu.Portal>
					<ContextMenu.Content
						class={contentClass}
						sideOffset={contentSideOffset}
						alignOffset={contentAlignOffset}
					>
						<ContextMenu.Item class={itemClass}>Open</ContextMenu.Item>
						<ContextMenu.Item class={itemClass}>Rename</ContextMenu.Item>
						<ContextMenu.Sub>
							<ContextMenu.SubTrigger class={subTriggerClass} {openDelay}>
								Move to...
								<CaretRight class="text-foreground-alt ml-auto size-4" />
							</ContextMenu.SubTrigger>
							<ContextMenu.Portal>
								<ContextMenu.SubContent
									class={subContentClass}
									sideOffset={subContentSideOffset}
									alignOffset={subContentAlignOffset}
								>
									<ContextMenu.Item class={itemClass}>Backlog</ContextMenu.Item>
									<ContextMenu.Item class={itemClass}
										>In Progress</ContextMenu.Item
									>
									<ContextMenu.Item class={itemClass}>Done</ContextMenu.Item>
									<ContextMenu.Sub>
										<ContextMenu.SubTrigger class={subTriggerClass} {openDelay}>
											Archive...
											<CaretRight
												class="text-foreground-alt ml-auto size-4"
											/>
										</ContextMenu.SubTrigger>
										<ContextMenu.Portal>
											<ContextMenu.SubContent
												class={subContentClass}
												sideOffset={subContentSideOffset}
												alignOffset={subContentAlignOffset}
											>
												<ContextMenu.Item class={itemClass}
													>Q1 2026</ContextMenu.Item
												>
												<ContextMenu.Item class={itemClass}
													>Q2 2026</ContextMenu.Item
												>
												<ContextMenu.Item class={itemClass}
													>Q3 2026</ContextMenu.Item
												>
												<ContextMenu.Item class={itemClass}
													>Q4 2026</ContextMenu.Item
												>
											</ContextMenu.SubContent>
										</ContextMenu.Portal>
									</ContextMenu.Sub>
								</ContextMenu.SubContent>
							</ContextMenu.Portal>
						</ContextMenu.Sub>
					</ContextMenu.Content>
				</ContextMenu.Portal>
			</ContextMenu.Root>
		</section>
	</div>
</div>
