<script lang="ts">
	import * as Sheet from "@/components/ui/sheet";
	import * as Button from "@/components/ui/button";
	import * as Label from "@/components/ui/label";
	import * as Input from "@/components/ui/input";
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button.Root builders={[builder]} variant="outline">Open</Button.Root>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Edit profile</Sheet.Title>
			<Sheet.Description>
				Make changes to your profile here. Click save when you're done.
			</Sheet.Description>
		</Sheet.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label.Root for="name" class="text-right">Name</Label.Root>
				<Input.Root id="name" value="Pedro Duarte" class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label.Root for="username" class="text-right">Username</Label.Root>
				<Input.Root id="username" value="@peduarte" class="col-span-3" />
			</div>
		</div>
		<Sheet.Footer>
			<Sheet.Close asChild let:builder>
				<Button.Root builders={[builder]} type="submit">Save changes</Button.Root>
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
