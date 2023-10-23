<script lang="ts">
	import * as Button from "@/components/ui/button";
	import * as DropdownMenu from "@/components/ui/dropdown-menu";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button.Root builders={[builder]} variant="outline">Open</Button.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label>My Account</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item>
				<span>Profile</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<span>Billing</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<span>Settings</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<span>Keyboard shortcuts</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item>
				<span>Team</span>
			</DropdownMenu.Item>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<span>Invite users</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Item>
						<span>Email</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<span>Message</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<span>More...</span>
					</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Item>
				<span>New Team</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<span>GitHub</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span>Support</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item href="/">
			Anchor Link
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span>API</span>
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<span>Log out</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
