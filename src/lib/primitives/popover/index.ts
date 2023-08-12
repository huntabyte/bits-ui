import Root from "./components/Popover.svelte";
import Content from "./components/PopoverContent.svelte";
import Trigger from "./components/PopoverTrigger.svelte";
import Close from "./components/PopoverClose.svelte";
export {
	Root,
	Close,
	Content,
	Trigger,
	//
	Root as Popover,
	Close as PopoverClose,
	Content as PopoverContent,
	Trigger as PopoverTrigger
};
export * from "./types.js";
