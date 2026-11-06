<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";
	const popupClassName =
		"[--bleed:3rem] [--peek:1rem] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-step:0.05] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--scale-base:calc(max(0,1-(var(--nested-drawers)*var(--stack-step))))] [--scale:clamp(0,calc(var(--scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--shrink:calc(1-var(--scale))] [--height:max(0px,calc(var(--drawer-frontmost-height,var(--drawer-height))-var(--bleed)))] group/popup relative -mb-[3rem] w-full max-h-[calc(80vh+3rem)] [height:var(--drawer-height,auto)] rounded-t-2xl bg-drawer px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+3rem)] text-foreground overflow-y-auto overscroll-contain touch-auto shadow-drawer data-[ending-style]:shadow-none [transform-origin:50%_calc(100%-var(--bleed))] [transform:translateY(calc(var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--shrink)*var(--height))))_scale(var(--scale))] after:absolute after:inset-0 after:rounded-[inherit] after:bg-transparent after:pointer-events-none after:content-[''] after:transition-[background-color] after:duration-[450ms] after:ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:select-none data-[swiping]:duration-0 data-[nested-drawer-swiping]:duration-0 data-[ending-style]:[transform:translateY(calc(100%-var(--bleed)+2px))] data-[starting-style]:[transform:translateY(calc(100%-var(--bleed)+2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[nested-drawer-stacked]:h-[calc(var(--height)+var(--bleed))] data-[nested-drawer-stacked]:overflow-hidden data-[nested-drawer-open]:after:bg-black/5 [transition:transform_450ms_cubic-bezier(0.32,0.72,0,1),height_450ms_cubic-bezier(0.32,0.72,0,1),box-shadow_450ms_cubic-bezier(0.32,0.72,0,1)]";

	const contentClassName =
		"mx-auto w-full max-w-[32rem] transition-opacity duration-[300ms] ease-[cubic-bezier(0.45,1.005,0,1.005)] group-data-[nested-drawer-open]/popup:opacity-0 group-data-[nested-drawer-swiping]/popup:opacity-100";

	const handleClassName =
		"mx-auto mb-4 h-1 w-12 rounded-full bg-dark-40 transition-opacity duration-[200ms] group-data-[nested-drawer-open]/popup:opacity-0 group-data-[nested-drawer-swiping]/popup:opacity-100";

	const backdropClassName =
		"fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-[nested]:pointer-events-none data-[nested]:opacity-0 data-[nested]:transition-none data-[swiping]:duration-0 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] dark:[--backdrop-opacity:0.7]";

	const linkClassName =
		"-m-0.5 rounded px-1.5 py-0.5 text-sm font-medium text-foreground underline underline-offset-4 hover:bg-dark-04 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 active:bg-dark-10";

	const closeClassName =
		"rounded-input bg-muted shadow-mini hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-10 select-none items-center justify-center px-[21px] text-[15px] font-medium focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]";
</script>

<Drawer.Root>
	<Drawer.Trigger
		class="inline-flex h-12 items-center justify-center rounded-input bg-dark px-[21px] text-[15px] font-semibold text-background shadow-mini select-none hover:bg-dark/95 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
	>
		View cart
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Backdrop class={backdropClassName} />
		<Drawer.Viewport
			class="fixed inset-0 z-[60] flex items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
		>
			<Drawer.Popup class={popupClassName}>
				<div class={handleClassName}></div>
				<Drawer.Content class={contentClassName}>
					<Drawer.Title class="mb-1 text-center text-lg font-semibold tracking-tight">
						Your Cart
					</Drawer.Title>
					<Drawer.Description class="mb-6 text-center text-sm text-foreground-alt">
						Review your items and proceed to checkout.
					</Drawer.Description>

					<ul class="mb-6 space-y-3">
						<li class="flex items-center gap-3 rounded-card-sm bg-muted p-3">
							<div
								class="flex size-10 shrink-0 items-center justify-center rounded-9px bg-dark-10 text-xs font-semibold"
							>
								RS
							</div>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium">Running Shoes</p>
								<p class="text-xs text-foreground-alt">Size 10 · Black</p>
							</div>
							<span class="shrink-0 text-sm font-semibold">$129</span>
						</li>
						<li class="flex items-center gap-3 rounded-card-sm bg-muted p-3">
							<div
								class="flex size-10 shrink-0 items-center justify-center rounded-9px bg-dark-10 text-xs font-semibold"
							>
								BC
							</div>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium">Baseball Cap</p>
								<p class="text-xs text-foreground-alt">One size · Navy</p>
							</div>
							<span class="shrink-0 text-sm font-semibold">$34</span>
						</li>
					</ul>

					<div
						class="mb-6 flex items-center justify-between border-t border-border-card pt-4"
					>
						<span class="text-sm text-foreground-alt">Subtotal</span>
						<span class="text-sm font-semibold">$163.00</span>
					</div>

					<div class="flex items-center justify-end gap-4">
						<div class="mr-auto">
							<Drawer.Root>
								<Drawer.Trigger class={linkClassName}>
									Shipping options
								</Drawer.Trigger>
								<Drawer.Portal>
									<Drawer.Backdrop class={backdropClassName} />
									<Drawer.Viewport
										class="fixed inset-0 z-[60] flex items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
									>
										<Drawer.Popup class={popupClassName}>
											<div class={handleClassName}></div>
											<Drawer.Content class={contentClassName}>
												<Drawer.Title
													class="mb-1 text-center text-lg font-semibold tracking-tight"
												>
													Shipping
												</Drawer.Title>
												<Drawer.Description
													class="mb-6 text-center text-sm text-foreground-alt"
												>
													Choose your preferred delivery speed.
												</Drawer.Description>

												<ul class="mb-6 space-y-2">
													<li
														class="flex items-center justify-between rounded-card-sm bg-muted p-3"
													>
														<div>
															<p class="text-sm font-medium">
																Standard
															</p>
															<p class="text-xs text-foreground-alt">
																5-7 business days
															</p>
														</div>
														<span class="text-sm font-semibold">
															Free
														</span>
													</li>
													<li
														class="flex items-center justify-between rounded-card-sm bg-muted p-3"
													>
														<div>
															<p class="text-sm font-medium">
																Express
															</p>
															<p class="text-xs text-foreground-alt">
																2-3 business days
															</p>
														</div>
														<span class="text-sm font-semibold">
															$12.99
														</span>
													</li>
													<li
														class="flex items-center justify-between rounded-card-sm bg-muted p-3"
													>
														<div>
															<p class="text-sm font-medium">
																Overnight
															</p>
															<p class="text-xs text-foreground-alt">
																Next business day
															</p>
														</div>
														<span class="text-sm font-semibold">
															$24.99
														</span>
													</li>
												</ul>

												<div class="flex items-center justify-end gap-4">
													<div class="mr-auto">
														<Drawer.Root>
															<Drawer.Trigger class={linkClassName}>
																Apply promo code
															</Drawer.Trigger>
															<Drawer.Portal>
																<Drawer.Backdrop
																	class={backdropClassName}
																/>
																<Drawer.Viewport
																	class="fixed inset-0 z-[60] flex items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
																>
																	<Drawer.Popup
																		class={popupClassName}
																	>
																		<div
																			class={handleClassName}
																		></div>
																		<Drawer.Content
																			class={contentClassName}
																		>
																			<Drawer.Title
																				class="mb-1 text-center text-lg font-semibold tracking-tight"
																			>
																				Promo Code
																			</Drawer.Title>
																			<Drawer.Description
																				class="mb-6 text-center text-sm text-foreground-alt"
																			>
																				Enter a code or gift
																				card to apply a
																				discount.
																			</Drawer.Description>

																			<div
																				class="mb-4 grid gap-1.5"
																			>
																				<label
																					class="text-sm font-medium"
																					for="promo-code"
																				>
																					Code
																				</label>
																				<input
																					id="promo-code"
																					class="h-input w-full rounded-input border border-border-input bg-background px-3 text-base placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background focus:outline-hidden md:text-sm"
																					placeholder="e.g. SAVE20"
																				/>
																			</div>

																			<div
																				class="mb-6 grid gap-1.5"
																			>
																				<label
																					class="text-sm font-medium"
																					for="gift-card"
																				>
																					Gift card
																				</label>
																				<input
																					id="gift-card"
																					class="h-input w-full rounded-input border border-border-input bg-background px-3 text-base placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background focus:outline-hidden md:text-sm"
																					placeholder="XXXX-XXXX-XXXX"
																				/>
																			</div>

																			<div
																				class="flex justify-end"
																			>
																				<Drawer.Close
																					class={closeClassName}
																				>
																					Apply
																				</Drawer.Close>
																			</div>
																		</Drawer.Content>
																	</Drawer.Popup>
																</Drawer.Viewport>
															</Drawer.Portal>
														</Drawer.Root>
													</div>

													<Drawer.Close class={closeClassName}>
														Close
													</Drawer.Close>
												</div>
											</Drawer.Content>
										</Drawer.Popup>
									</Drawer.Viewport>
								</Drawer.Portal>
							</Drawer.Root>
						</div>

						<Drawer.Close class={closeClassName}>Close</Drawer.Close>
					</div>
				</Drawer.Content>
			</Drawer.Popup>
		</Drawer.Viewport>
	</Drawer.Portal>
</Drawer.Root>
