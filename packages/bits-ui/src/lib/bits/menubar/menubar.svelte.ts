import { box } from "svelte-toolbelt";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { type UseRovingFocusReturn, useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";
import type { Direction } from "$lib/shared/index.js";

const ROOT_ATTR = "data-menubar-root";
const TRIGGER_ATTR = "data-menubar-trigger";

type MenubarRootStateProps = ReadableBoxedValues<{
	id: string;
	dir: Direction;
	loop: boolean;
}> &
	WritableBoxedValues<{
		value: string;
	}>;

class MenubarRootState {
	id: MenubarRootStateProps["id"];
	value: MenubarRootStateProps["value"];
	dir: MenubarRootStateProps["dir"];
	#loop: MenubarRootStateProps["loop"];
	rovingFocusGroup: UseRovingFocusReturn;
	currentTabStopId = box<string | null>(null);

	constructor(props: MenubarRootStateProps) {
		this.value = props.value;
		this.dir = props.dir;
		this.#loop = props.loop;
		this.id = props.id;
		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: this.id,
			candidateSelector: TRIGGER_ATTR,
			loop: this.#loop,
			orientation: box.with(() => "horizontal"),
			currentTabStopId: this.currentTabStopId,
		});
	}

	onMenuOpen(value: string) {
		this.value.value = value;
		this.currentTabStopId.value = value;
	}

	onMenuClose() {
		this.value.value = "";
	}

	onMenuToggle(value: string) {
		this.value.value = this.value.value ? "" : value;
	}
}
