<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	const backdropClass =
		"fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]";

	const viewportClass =
		"fixed inset-0 z-[60] flex items-stretch justify-end p-[var(--viewport-padding)] [padding-bottom:calc(var(--viewport-padding)+var(--drawer-keyboard-inset))] [--viewport-padding:0px] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]";

	const popupClass =
		"bg-drawer text-foreground shadow-drawer -mr-[3rem] h-full w-[calc(20rem+3rem)] max-w-[calc(100vw-3rem+3rem)] touch-auto overflow-y-auto overscroll-contain p-6 pr-[calc(1.5rem+3rem)] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] [transform:translateX(var(--drawer-swipe-movement-x))] data-[swiping]:select-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[ending-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-[starting-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px] supports-[-webkit-touch-callout:none]:pr-6 supports-[-webkit-touch-callout:none]:[--bleed:0px]";

	const nestedPopupClass =
		"bg-drawer text-foreground shadow-drawer -mr-[3rem] h-full w-[calc(18rem+3rem)] max-w-[calc(100vw-3rem+3rem)] touch-auto overflow-y-auto overscroll-contain p-6 pr-[calc(1.5rem+3rem)] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] [transform:translateX(var(--drawer-swipe-movement-x))] data-[swiping]:select-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[ending-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-[starting-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[18rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px] supports-[-webkit-touch-callout:none]:pr-6 supports-[-webkit-touch-callout:none]:[--bleed:0px]";

	const nestedDeepPopupClass =
		"bg-drawer text-foreground shadow-drawer -mr-[3rem] h-full w-[calc(16rem+3rem)] max-w-[calc(100vw-3rem+3rem)] touch-auto overflow-y-auto overscroll-contain p-6 pr-[calc(1.5rem+3rem)] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] [transform:translateX(var(--drawer-swipe-movement-x))] data-[swiping]:select-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[ending-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-[starting-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[16rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px] supports-[-webkit-touch-callout:none]:pr-6 supports-[-webkit-touch-callout:none]:[--bleed:0px]";

	const closeClass =
		"rounded-input bg-muted shadow-mini hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-10 select-none items-center justify-center px-[21px] text-[15px] font-medium focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]";

	const linkClass =
		"-m-0.5 rounded px-1.5 py-0.5 text-sm font-medium text-foreground underline underline-offset-4 hover:bg-dark-04 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 active:bg-dark-10";
</script>

<Drawer.Root swipeDirection="right">
	<Drawer.Trigger
		class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-12 select-none items-center justify-center px-[21px] text-[15px] font-semibold active:scale-[0.98]"
	>
		Nested Right Drawers
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Backdrop class={backdropClass} />
		<Drawer.Viewport class={viewportClass}>
			<Drawer.Popup class={popupClass}>
				<Drawer.Content class="mx-auto flex h-full w-full max-w-[32rem] flex-col">
					<Drawer.Title
						class="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-widest"
					>
						Workspace
					</Drawer.Title>
					<Drawer.Description class="text-foreground-alt mb-6 text-sm">
						Open nested drawers that all slide from the right side.
					</Drawer.Description>

					<div class="space-y-3">
						<div class="rounded-card-sm bg-muted p-3">
							<p class="text-sm font-medium">General settings</p>
							<p class="text-foreground-alt mt-0.5 text-xs">
								Timezone, locale, and visibility
							</p>
						</div>
						<div class="rounded-card-sm bg-muted p-3">
							<p class="text-sm font-medium">Collaborators</p>
							<p class="text-foreground-alt mt-0.5 text-xs">
								Manage members and roles
							</p>
						</div>
					</div>

					<div class="mt-6 flex items-center justify-between">
						<Drawer.Root swipeDirection="right">
							<Drawer.Trigger class={linkClass}>Open collaborators</Drawer.Trigger>
							<Drawer.Portal>
								<Drawer.Backdrop class={backdropClass} />
								<Drawer.Viewport class={viewportClass}>
									<Drawer.Popup class={nestedPopupClass}>
										<Drawer.Content
											class="mx-auto flex h-full w-full max-w-[28rem] flex-col"
										>
											<Drawer.Title
												class="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-widest"
											>
												Collaborators
											</Drawer.Title>
											<Drawer.Description
												class="text-foreground-alt mb-5 text-sm"
											>
												Invite someone new. This input is for keyboard
												behavior testing.
											</Drawer.Description>

											<div class="mb-4 space-y-2">
												<label
													for="invite-email"
													class="text-foreground text-sm font-medium"
												>
													Invite by email
												</label>
												<input
													id="invite-email"
													type="email"
													placeholder="teammate@company.com"
													class="border-border-input bg-background rounded-input text-foreground placeholder:text-foreground-alt h-10 w-full border px-3 text-sm outline-none"
												/>
											</div>

											<div class="mb-6 space-y-2">
												<label
													for="invite-role"
													class="text-foreground text-sm font-medium"
												>
													Role
												</label>
												<input
													id="invite-role"
													type="text"
													placeholder="Editor"
													class="border-border-input bg-background rounded-input text-foreground placeholder:text-foreground-alt h-10 w-full border px-3 text-sm outline-none"
												/>
											</div>

											<div class="mt-auto flex items-center justify-between">
												<Drawer.Root swipeDirection="right">
													<Drawer.Trigger class={linkClass}
														>Advanced roles</Drawer.Trigger
													>
													<Drawer.Portal>
														<Drawer.Backdrop class={backdropClass} />
														<Drawer.Viewport class={viewportClass}>
															<Drawer.Popup
																class={nestedDeepPopupClass}
															>
																<Drawer.Content
																	class="mx-auto w-full max-w-[24rem]"
																>
																	<Drawer.Title
																		class="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-widest"
																	>
																		Advanced Roles
																	</Drawer.Title>
																	<Drawer.Description
																		class="text-foreground-alt mb-5 text-sm"
																	>
																		Permissions for custom
																		project roles.
																	</Drawer.Description>
																	<ul class="space-y-2 text-sm">
																		<li
																			class="rounded-card-sm bg-muted p-3"
																		>
																			Can publish releases
																		</li>
																		<li
																			class="rounded-card-sm bg-muted p-3"
																		>
																			Can manage billing
																		</li>
																		<li
																			class="rounded-card-sm bg-muted p-3"
																		>
																			Can modify access rules
																		</li>
																	</ul>
																	<div
																		class="mt-6 flex justify-end"
																	>
																		<Drawer.Close
																			class={closeClass}
																			>Done</Drawer.Close
																		>
																	</div>
																</Drawer.Content>
															</Drawer.Popup>
														</Drawer.Viewport>
													</Drawer.Portal>
												</Drawer.Root>

												<Drawer.Close class={closeClass}>Save</Drawer.Close>
											</div>
										</Drawer.Content>
									</Drawer.Popup>
								</Drawer.Viewport>
							</Drawer.Portal>
						</Drawer.Root>

						<Drawer.Close class={closeClass}>Close</Drawer.Close>
					</div>
				</Drawer.Content>
			</Drawer.Popup>
		</Drawer.Viewport>
	</Drawer.Portal>
</Drawer.Root>
