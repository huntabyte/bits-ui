<script lang="ts">
	import * as Tabs from "$lib/bits/tabs";
</script>

<div class="bg-primary rounded-xl p-4">
	<Tabs.Root value="account" class="w-[400px]">
		<Tabs.List
			class="bg-primary/5 grid w-full grid-cols-2 rounded-lg border border-muted-foreground p-1"
		>
			<Tabs.Trigger
				value="account"
				class="h-10 rounded-md data-[state=active]:bg-muted"
				>Account</Tabs.Trigger
			>
			<Tabs.Trigger
				value="password"
				class="h-10 rounded-md data-[state=active]:bg-muted"
				>Password</Tabs.Trigger
			>
		</Tabs.List>
		<Tabs.Content value="account">Account</Tabs.Content>
		<Tabs.Content value="password">Password</Tabs.Content>
	</Tabs.Root>
</div>
