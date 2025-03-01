import { getContext, hasContext, setContext } from "svelte";

export type SiteConfig = {
	name: string;
	url: string;
	description: string;
	links?: {
		x?: string;
		github?: string;
	};
	author?: string;
	keywords?: string[];
	ogImage?: {
		url: string;
		width: string;
		height: string;
	};
	license?: {
		name: string;
		url: string;
	};
};

export function createSiteConfig(config: SiteConfigState) {
	return config;
}

export function defineSiteConfig(config: SiteConfig) {
	return config;
}

class SiteConfigState {
	current = $derived.by(() => this.getProps());
	constructor(readonly getProps: () => SiteConfig) {}
}

const SITE_CONFIG_KEY = Symbol("sveco-site-config");

export function useSiteConfig(getProps?: () => SiteConfig): SiteConfigState {
	if (getProps) {
		return setContext(SITE_CONFIG_KEY, new SiteConfigState(getProps));
	} else if (hasContext(SITE_CONFIG_KEY)) {
		return getContext(SITE_CONFIG_KEY);
	} else {
		throw new Error(
			"useSiteConfig must be called with a function that returns a SiteConfigProps object"
		);
	}
}
