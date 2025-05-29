import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { BitsConfigPropsWithoutChildren } from "$lib/bits/utilities/config/types.js";
import { Context } from "runed";
import { box, type ReadableBox } from "svelte-toolbelt";

type BitsConfigStateProps = ReadableBoxedValues<BitsConfigPropsWithoutChildren>;

export const BitsConfigContext = new Context<BitsConfigStateProps>("BitsConfig");

export function getBitsConfig() {
	const config = BitsConfigContext.getOr(null);
	if (config === null) {
		return {};
	}
	return config;
}

export function useBitsConfig(opts: BitsConfigStateProps) {
	const parent = BitsConfigContext.getOr(null);
	return new BitsConfigState(parent, opts);
}

class BitsConfigState {
	readonly opts: BitsConfigStateProps;

	constructor(parent: BitsConfigStateProps | null, opts: BitsConfigStateProps) {
		if (parent === null) {
			this.opts = opts;
		} else {
			const fallback = fallbackFactory(parent, opts);
			this.opts = {
				defaultPortalTo: fallback.of((config) => config.defaultPortalTo),
			};
		}
		BitsConfigContext.set(this.opts);
	}
}

type FallbackFactory = {
	of<T>(
		getter: (config: BitsConfigStateProps) => ReadableBox<T> | undefined
	): ReadableBox<T | undefined>;
};

function fallbackFactory(
	parent: BitsConfigStateProps | null,
	opts: BitsConfigStateProps
): FallbackFactory {
	return {
		of<T>(
			getter: (config: BitsConfigStateProps) => ReadableBox<T> | undefined
		): ReadableBox<T | undefined> {
			if (parent === null) {
				return box.with(() => getter(opts)?.current);
			}
			return box.with(() => {
				const value = getter(opts)?.current;
				if (value !== undefined) {
					return value;
				}
				return getter(parent)?.current;
			});
		},
	};
}
