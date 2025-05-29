<script lang="ts">
	import { BitsConfig, getBitsConfig } from "bits-ui";

	function ConfigDisplay() {
		const config = getBitsConfig();
		const portalTo = config.defaultPortalTo?.current;
		const locale = config.defaultLocale?.current;

		return {
			portalTo: portalTo ?? "undefined",
			locale: locale ?? "undefined",
		};
	}

	const noConfigResult = ConfigDisplay();
</script>

<!-- no config (baseline) -->
<div data-testid="no-config">
	<span data-testid="no-config-portal">{noConfigResult.portalTo}</span>
	<span data-testid="no-config-locale">{noConfigResult.locale}</span>
</div>

<!-- root config -->
<BitsConfig defaultPortalTo="#root-portal" defaultLocale="en">
	{@const result = ConfigDisplay()}
	<div data-testid="root-config">
		<span data-testid="root-config-portal">{result.portalTo}</span>
		<span data-testid="root-config-locale">{result.locale}</span>
	</div>
</BitsConfig>

<!-- child inherits parent -->
<BitsConfig defaultPortalTo="#parent-portal" defaultLocale="en">
	<BitsConfig>
		{@const result = ConfigDisplay()}
		<div data-testid="child-inherits">
			<span data-testid="child-inherits-portal">{result.portalTo}</span>
			<span data-testid="child-inherits-locale">{result.locale}</span>
		</div>
	</BitsConfig>
</BitsConfig>

<!-- child overrides parent -->
<BitsConfig defaultPortalTo="#parent-portal" defaultLocale="en">
	<BitsConfig defaultPortalTo="#child-portal">
		{@const result = ConfigDisplay()}
		<div data-testid="child-overrides">
			<span data-testid="child-overrides-portal">{result.portalTo}</span>
			<span data-testid="child-overrides-locale">{result.locale}</span>
		</div>
	</BitsConfig>
</BitsConfig>

<!-- deep nesting -->
<BitsConfig defaultPortalTo="#level1" defaultLocale="en">
	<BitsConfig defaultLocale="es">
		<BitsConfig>
			{@const result = ConfigDisplay()}
			<div data-testid="deep-nesting">
				<span data-testid="deep-nesting-portal">{result.portalTo}</span>
				<span data-testid="deep-nesting-locale">{result.locale}</span>
			</div>
		</BitsConfig>
	</BitsConfig>
</BitsConfig>

<!-- multiple partial overrides -->
<BitsConfig defaultPortalTo="#base" defaultLocale="en">
	<BitsConfig defaultLocale="fr">
		<BitsConfig defaultPortalTo="#override">
			{@const result = ConfigDisplay()}
			<div data-testid="partial-override">
				<span data-testid="partial-override-portal">{result.portalTo}</span>
				<span data-testid="partial-override-locale">{result.locale}</span>
			</div>
		</BitsConfig>
	</BitsConfig>
</BitsConfig>
