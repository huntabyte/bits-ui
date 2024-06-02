import { box } from "svelte-toolbelt";
import { Set } from "svelte/reactivity";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useId } from "$lib/internal/useId.svelte.js";
import type { Direction } from "$lib/shared/index.js";
import { createContext } from "$lib/internal/createContext.js";
import { useFormControl } from "$lib/internal/useFormControl.svelte.js";
import { useNodeById } from "$lib/internal/useNodeById.svelte.js";

type SelectRootStateProps = WritableBoxedValues<{
	open: boolean;
	value: string;
}> &
	ReadableBoxedValues<{
		dir: Direction;
		disabled: boolean;
		required: boolean;
	}>;

type SelectNativeOption = {
	value: string;
	key: string;
	disabled: boolean;
	innerHTML: string;
};

class SelectRootState {
	open: SelectRootStateProps["open"];
	value: SelectRootStateProps["value"];
	dir: SelectRootStateProps["dir"];
	disabled: SelectRootStateProps["disabled"];
	required: SelectRootStateProps["required"];
	triggerNode = box<HTMLElement | null>(null);
	valueNode = box<HTMLElement | null>(null);
	contentId = box.with(() => useId());
	triggerPointerDownPos = box<{ x: number; y: number } | null>({ x: 0, y: 0 });

	// A set of all the native options we'll use to render the native select element under the hood
	nativeOptionsSet = new Set<SelectNativeOption>();
	// A key we'll use to rerender the native select when the options change to keep it in sync
	nativeSelectKey = $derived.by(() => {
		return Array.from(this.nativeOptionsSet)
			.map((opt) => opt.value)
			.join(";");
	});

	nativeOptionsArr = $derived.by(() => Array.from(this.nativeOptionsSet));

	isFormControl = useFormControl(this.triggerNode);

	constructor(props: SelectRootStateProps) {
		this.open = props.open;
		this.value = props.value;
		this.dir = props.dir;
		this.disabled = props.disabled;
		this.required = props.required;
	}

	onNativeOptionAdd(option: SelectNativeOption) {
		this.nativeOptionsSet.add(option);
	}

	onNativeOptionRemove(option: SelectNativeOption) {
		this.nativeOptionsSet.delete(option);
	}
}

type SelectTriggerStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean;
}>;

class SelectTriggerState {
	root: SelectRootState;
	id: SelectTriggerStateProps["id"];

	constructor(props: SelectTriggerStateProps, root: SelectRootState) {
		this.id = props.id;
		this.root = root;
		this.root.triggerNode = useNodeById(this.id);
	}
}

const [setSelectRootContext, getSelectRootContext] = createContext<SelectRootState>("Select.Root");

export function useSelectRoot(props: SelectRootStateProps) {
	return setSelectRootContext(new SelectRootState(props));
}
