import { getContext, hasContext, setContext } from "svelte";

type CopyToClipboardProps = {
	timeout?: number;
	onCopy?: () => void;
};

export class CopyToClipboard {
	isCopied = $state(false);
	codeString = $state("");
	timeout = $derived.by(() => this.opts.timeout ?? 2000);

	constructor(readonly opts: CopyToClipboardProps = {}) {}

	setCodeString = (v: string) => {
		this.codeString = v;
	};

	copyToClipboard = (value: string = this.codeString) => {
		if (typeof window === "undefined" || !navigator.clipboard.writeText) return;
		if (!value) return;

		navigator.clipboard.writeText(value).then(() => {
			this.isCopied = true;

			if (this.opts.onCopy) {
				this.opts.onCopy();
			}

			setTimeout(() => {
				this.isCopied = false;
			}, this.timeout);
		}, console.error);
	};

	setCodeStringAction = (node: HTMLElement) => {
		this.codeString = node.innerText.trim() ?? "";
	};
}

const COPY_TO_CLIPBOARD_KEY = Symbol("copy-to-clipboard");

export function setCopyToClipboard(props?: CopyToClipboardProps) {
	return setContext(COPY_TO_CLIPBOARD_KEY, new CopyToClipboard(props));
}

export function useCopyToClipboard() {
	if (!hasContext(COPY_TO_CLIPBOARD_KEY)) {
		return null;
	}
	return getContext<CopyToClipboard>(COPY_TO_CLIPBOARD_KEY);
}
