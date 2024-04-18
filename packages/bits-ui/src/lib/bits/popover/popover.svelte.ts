import type { FloatingContentStateProps } from "../utilities/floating/floating.svelte.js";
import type { Box, BoxedValues, ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";
import type { EventCallback } from "$lib/internal/events.js";
import { useNodeById } from "$lib/internal/use-node-by-id.svelte.js";

type PopoverRootStateProps = BoxedValues<{
	open: boolean;
}>;

class PopoverRootState {
	open = undefined as unknown as PopoverRootStateProps["open"];

	constructor(props: PopoverRootStateProps) {
		this.open = props.open;
	}
}

type PopoverTriggerStateProps = ReadonlyBoxedValues<{
	id: string;
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
}>;

class PopoverTriggerState {
	id = undefined as unknown as PopoverTriggerStateProps["id"];
	node = undefined as unknown as Box<HTMLElement | null>;
	onclick = undefined as unknown as PopoverTriggerStateProps["onclick"];
	onkeydown = undefined as unknown as PopoverTriggerStateProps["onkeydown"];

	constructor(props: PopoverTriggerStateProps) {
		this.id = props.id;
		this.onclick = props.onclick;
		this.onkeydown = props.onkeydown;
		this.node = useNodeById(this.id);
	}
}

type PopoverContentStateProps = ReadonlyBoxedValues<{
	id: string;
}>;

class PopoverContentState {
	id = undefined as unknown as PopoverContentStateProps["id"];
	node = undefined as unknown as Box<HTMLElement | null>;

	constructor(props: PopoverContentStateProps) {
		this.id = props.id;
		this.node = useNodeById(this.id);
	}
}
