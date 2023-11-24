<script lang="ts">
	import { Tabs, Label, Button } from "$lib";
	import { LockKeyOpen } from "phosphor-svelte";
</script>

<div class="pt-6">
	<Tabs.Root
		value="login"
		class="w-[428px] rounded-card border border-muted bg-background p-6 shadow-card"
	>
		<Tabs.List
			class="grid w-full grid-cols-2 gap-1 rounded-[9px] bg-dark-4 p-1 shadow-mini-inset"
		>
			<Tabs.Trigger
				value="login"
				class="h-8 rounded-[7px] bg-transparent py-2 text-sm font-semibold leading-[0.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=active]:bg-white data-[state=active]:shadow-mini dark:data-[state=active]:bg-background"
				>Login</Tabs.Trigger
			>
			<Tabs.Trigger
				value="register"
				class="h-8 rounded-[7px] bg-transparent py-2 text-sm font-semibold leading-[0.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=active]:bg-white data-[state=active]:shadow-mini dark:data-[state=active]:bg-background"
				>Register</Tabs.Trigger
			>
		</Tabs.List>
		<Tabs.Content value="login" class="pt-6 focus-visible:outline-none">
			<div class="flex flex-col">
				<h4 class="text-[19px] font-semibold leading-none tracking-[-0.01em]">
					Login to your account
				</h4>
				<p class="text-sm font-medium text-muted-foreground">
					to access all your data
				</p>
			</div>
			<div class="flex flex-col gap-4 pt-5">
				<div class="flex flex-col gap-1">
					<Label.Root
						for="username"
						class="text-sm font-medium text-foreground"
					>
						Username
					</Label.Root>
					<input
						type="text"
						id="username"
						placeholder="name@example.com"
						class="inline-flex h-input w-full items-center rounded-card-sm border border-dark-10 bg-background px-4 text-sm placeholder:text-foreground-alt/50 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
					/>
				</div>
				<div class="flex flex-col gap-1">
					<Label.Root
						for="password"
						class="text-sm font-medium text-foreground"
					>
						Password
					</Label.Root>
					<div class="relative w-full">
						<input
							id="password"
							class="inline-flex h-input w-full items-center rounded-card-sm border border-dark-10 bg-background px-4 text-sm placeholder:text-foreground-alt/50 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
							placeholder="super_secret"
							type="password"
							autocomplete="off"
						/>
						<LockKeyOpen
							class="absolute right-4 top-[14px] h-[22px] w-[22px] text-dark/30"
						/>
					</div>
				</div>
			</div>
			<Button.Root
				class="hover:button-gradient mt-[22px] inline-flex h-input w-full items-center justify-center rounded-input bg-dark px-[50px] text-[15px] font-semibold text-background shadow-mini focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			>
				Login
			</Button.Root>
		</Tabs.Content>
		<Tabs.Content value="register" class="pt-6 focus-visible:outline-none">
			<div class="flex flex-col">
				<h4 class="text-[19px] font-semibold leading-none tracking-[-0.01em]">
					Register for an account
				</h4>
				<p class="text-sm font-medium text-muted-foreground">
					to start using all our features
				</p>
			</div>
			<div class="flex flex-col gap-4 pt-5">
				<div class="flex flex-col gap-1">
					<Label.Root
						for="registerUsername"
						class="text-sm font-medium text-foreground"
					>
						Username
					</Label.Root>
					<input
						type="text"
						id="registerUsername"
						placeholder="name@example.com"
						class="inline-flex h-input w-full items-center rounded-card-sm border border-dark-10 bg-background px-4 text-sm placeholder:text-foreground-alt/50 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
					/>
				</div>
				<div class="flex flex-col gap-1">
					<Label.Root
						for="registerPassword"
						class="text-sm font-medium text-foreground"
					>
						Password
					</Label.Root>
					<div class="relative w-full">
						<input
							id="registerPassword"
							class="inline-flex h-input w-full items-center rounded-card-sm border border-dark-10 bg-background px-4 text-sm placeholder:text-foreground-alt/50 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
							placeholder="super_secret"
							type="password"
							autocomplete="off"
						/>
						<LockKeyOpen
							class="absolute right-4 top-[14px] h-[22px] w-[22px] text-dark/30"
						/>
					</div>
				</div>
				<div class="flex flex-col gap-1">
					<Label.Root
						for="passwordConfirm"
						class="text-sm font-medium text-foreground"
					>
						Confirm Password
					</Label.Root>
					<div class="relative w-full">
						<input
							id="passwordConfirm"
							class="inline-flex h-input w-full items-center rounded-card-sm border border-dark-10 bg-background px-4 text-sm placeholder:text-foreground-alt/50 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
							placeholder="super_secret"
							type="password"
							autocomplete="off"
						/>
						<LockKeyOpen
							class="absolute right-4 top-[14px] h-[22px] w-[22px] text-dark/30"
						/>
					</div>
				</div>
			</div>
			<Button.Root
				class="hover:button-gradient mt-[22px] inline-flex h-input w-full items-center justify-center rounded-input bg-dark px-[50px] text-[15px] font-semibold text-background shadow-mini focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			>
				Login
			</Button.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
