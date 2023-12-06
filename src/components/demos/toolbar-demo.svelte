<script lang="ts">
	import { Toolbar } from "$lib";
	import { TextB, TextItalic, TextStrikethrough } from "phosphor-svelte";

	let value: string[] | undefined = ["bold"];
</script>

<Toolbar.Root
	class="flex h-input min-w-max items-center gap-4 rounded-card-sm border border-border bg-background px-3 py-2 shadow-mini"
>
	<Toolbar.Group
		bind:value
		type="multiple"
		class="flex items-center gap-x-0.5 rounded-card-sm"
	>
		<Toolbar.GroupItem
			aria-label="toggle bold"
			value="bold"
			class="inline-flex items-center justify-center rounded-[9px] bg-background transition-all sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 data-[state=on]:bg-muted active:data-[state=on]:bg-dark-10"
		>
			<TextB class="sq-6" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem
			aria-label="toggle italic"
			value="italic"
			class="inline-flex items-center justify-center rounded-[9px] bg-background transition-all sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 data-[state=on]:bg-muted active:data-[state=on]:bg-dark-10"
		>
			<TextItalic class="sq-6" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem
			aria-label="toggle strikethrough"
			value="strikethrough"
			class="inline-flex items-center justify-center rounded-[9px] bg-background transition-all sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 data-[state=on]:bg-muted active:data-[state=on]:bg-dark-10"
		>
			<TextStrikethrough class="sq-6" />
		</Toolbar.GroupItem>
	</Toolbar.Group>

	<Toolbar.Separator class="w-[1px] self-stretch bg-muted" />

	<Toolbar.Link
		class="link nowrap flex-shrink-0"
		href="/docs/components/toolbar"
	>
		Edited 2 hours ago
	</Toolbar.Link>

	<Toolbar.Button
		class="inline-flex h-8 items-center justify-center rounded-input bg-foreground px-3 py-2 font-medium text-background transition-all hover:cursor-pointer"
	>
		Save
	</Toolbar.Button>
</Toolbar.Root>
