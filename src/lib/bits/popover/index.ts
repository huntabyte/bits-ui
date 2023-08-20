import Root from "./components/Popover.svelte";
import Arrow from "./components/PopoverArrow.svelte";
import Content from "./components/PopoverContent.svelte";
import Trigger from "./components/PopoverTrigger.svelte";
import Close from "./components/PopoverClose.svelte";
export {
	Root,
	Arrow,
	Close,
	Content,
	Trigger,
	//
	Root as Popover,
	Arrow as PopoverArrow,
	Close as PopoverClose,
	Content as PopoverContent,
	Trigger as PopoverTrigger
};
export * from "./types.js";
