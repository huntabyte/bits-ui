<script lang="ts">
	import * as Tabs from "$lib/bits/tabs";
</script>

<div class="bg-primary p-4 rounded-xl">
	<Tabs.Root value="account" class="w-[400px]">
		<Tabs.List
			class="grid w-full grid-cols-2 bg-primary/5 rounded-lg p-1 border border-muted-foreground"
		>
			<Tabs.Trigger value="account" class="h-10 rounded-md data-[state=active]:bg-muted"
				>Account</Tabs.Trigger
			>
			<Tabs.Trigger value="password" class="h-10 rounded-md data-[state=active]:bg-muted"
				>Password</Tabs.Trigger
			>
		</Tabs.List>
		<Tabs.Content value="account">Account</Tabs.Content>
		<Tabs.Content value="password">Password</Tabs.Content>
	</Tabs.Root>
</div>
