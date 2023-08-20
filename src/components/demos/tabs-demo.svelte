<script lang="ts">
	import * as Tabs from "@/components/ui/tabs";
	import * as Card from "@/components/ui/card";
	import * as Button from "@/components/ui/button";
	import * as Input from "@/components/ui/input";
	import * as Label from "@/components/ui/label";
</script>

<Tabs.Root value="account" class="w-[400px]">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="account">Account</Tabs.Trigger>
		<Tabs.Trigger value="password">Password</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="account">
		<Card.Root>
			<Card.Header>
				<Card.Title>Account</Card.Title>
				<Card.Description>
					Make changes to your account here. Click save when you're done.
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<div class="space-y-1">
					<Label.Root for="name">Name</Label.Root>
					<Input.Root id="name" value="Pedro Duarte" />
				</div>
				<div class="space-y-1">
					<Label.Root for="username">Username</Label.Root>
					<Input.Root id="username" value="@peduarte" />
				</div>
			</Card.Content>
			<Card.Footer>
				<Button.Root>Save changes</Button.Root>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="password">
		<Card.Root>
			<Card.Header>
				<Card.Title>Password</Card.Title>
				<Card.Description>
					Change your password here. After saving, you'll be logged out.
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<div class="space-y-1">
					<Label.Root for="current">Current password</Label.Root>
					<Input.Root id="current" type="password" />
				</div>
				<div class="space-y-1">
					<Label.Root for="new">New password</Label.Root>
					<Input.Root id="new" type="password" />
				</div>
			</Card.Content>
			<Card.Footer>
				<Button.Root>Save password</Button.Root>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
