import { getContext as getSvelteContext, hasContext, setContext as setSvelteContext } from "svelte";

function setContext<T>(key: symbol | string, value: T): T {
	return setSvelteContext(key, value);
}

function getContext<T>(key: symbol | string, fallback?: T): T {
	const trueKey = typeof key === "symbol" ? key : key;
	const description = typeof key === "symbol" ? key.description : key;

	if (!hasContext(trueKey)) {
		if (fallback === undefined) {
			throw new Error(
				`Missing context dependency: ${description} and no fallback was provided.`
			);
		}
		return fallback as T;
	}
	return getSvelteContext(key);
}

function getSymbolDescription(providerComponentName: string | string[], contextName?: string) {
	if (contextName !== undefined) return contextName;
	if (typeof providerComponentName === "string" && contextName === undefined) {
		return `${providerComponentName}Context`;
	} else if (Array.isArray(providerComponentName) && contextName === undefined) {
		return `${providerComponentName[0]}Context`;
	} else {
		if (contextName !== undefined) return contextName;
		return `${providerComponentName}Context`;
	}
}

export function createContext<ContextValue>(
	providerComponentName: string | string[],
	contextName?: string,
	useSymbol = true
) {
	const symbolDescription = getSymbolDescription(providerComponentName, contextName);
	const symbol = Symbol(symbolDescription);
	const key = symbolDescription;

	function getCtx<T extends ContextValue | null | undefined = ContextValue>(
		fallback?: T
	): T extends null ? ContextValue | null : ContextValue {
		const context = getContext<T>(useSymbol ? symbol : key, fallback);
		if (context === undefined) {
			throw new Error(
				`Context \`${symbolDescription}\` not found. Component must be used within ${
					Array.isArray(providerComponentName)
						? `one of the following components: ${providerComponentName.join(", ")}`
						: `\`${providerComponentName}\``
				}`
			);
		}
		// eslint-disable-next-line ts/no-explicit-any
		if (context === null) return context as any;
		return context;
	}

	function setCtx(value: ContextValue): ContextValue {
		if (useSymbol) {
			return setContext(symbol, value);
		} else {
			return setContext(key, value);
		}
	}

	return [setCtx, getCtx] as const;
}
