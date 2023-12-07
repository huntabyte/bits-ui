<script lang="ts">
	import { Separator, Toolbar } from "$lib";
	import {
		TextB,
		TextItalic,
		TextStrikethrough,
		TextAlignLeft,
		TextAlignCenter,
		TextAlignRight
	} from "phosphor-svelte";

	let text: string[] | undefined = ["bold"];
	let align: string | undefined;
</script>

<Toolbar.Root
	class="flex h-12 min-w-max items-center justify-center rounded-10px border border-dark-10 bg-background shadow-mini"
>
	<Toolbar.Group
		bind:value={text}
		type="multiple"
		class="flex items-center gap-x-0.5 rounded-card-sm p-1"
	>
		<Toolbar.GroupItem
			aria-label="toggle bold"
			value="bold"
			class="inline-flex items-center justify-center rounded-[9px] bg-background text-foreground/60 transition-all sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10"
		>
			<TextB class="sq-6" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem
			aria-label="toggle italic"
			value="italic"
			class="inline-flex items-center justify-center rounded-[9px] bg-background text-foreground/60 transition-all sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10"
		>
			<TextItalic class="sq-6" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem
			aria-label="toggle strikethrough"
			value="strikethrough"
			class="inline-flex items-center justify-center rounded-[9px] bg-background text-foreground/60 transition-all sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10"
		>
			<TextStrikethrough class="sq-6" />
		</Toolbar.GroupItem>
	</Toolbar.Group>

	<Separator.Root class="mx-1 w-[1px] self-stretch bg-muted" />

	<Toolbar.Group
		bind:value={align}
		type="single"
		class="flex items-center gap-x-0.5 rounded-card-sm p-1"
	>
		<Toolbar.GroupItem
			aria-label="align left"
			value="left"
			class="inline-flex items-center justify-center rounded-[9px] bg-background text-foreground/60 transition-all sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10"
		>
			<TextAlignLeft class="sq-6" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem
			aria-label="align center"
			value="center"
			class="inline-flex items-center justify-center rounded-[9px] bg-background text-foreground/60 transition-all sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10"
		>
			<TextAlignCenter class="sq-6" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem
			aria-label="align right"
			value="right"
			class="inline-flex items-center justify-center rounded-[9px] bg-background text-foreground/60 transition-all sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10"
		>
			<TextAlignRight class="sq-6" />
		</Toolbar.GroupItem>
	</Toolbar.Group>

	<Separator.Root class="mx-1 w-[1px] self-stretch bg-muted" />

	<Toolbar.Link
		class="link nowrap ml-3 mr-6 flex-shrink-0 text-foreground/60 no-underline transition-all hover:text-foreground/80 hover:underline"
		href="/docs/components/toolbar"
	>
		Edited 2 hours ago
	</Toolbar.Link>

	<Toolbar.Button
		class="mr-[5px] inline-flex h-9 items-center justify-center rounded-input bg-foreground/60 px-3 py-2 font-medium text-background transition-all hover:cursor-pointer"
	>
		Save
	</Toolbar.Button>
</Toolbar.Root>
