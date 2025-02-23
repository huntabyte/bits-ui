import sdk from "@stackblitz/sdk";

export async function openInStackBlitz(demoName: string, componentName?: string) {
	try {
		const res = await fetch(`/api/demos.json?name=${demoName}`);
		if (!res.ok) {
			console.error("Failed to fetch demo code from server.");
			return;
		}

		const { code: demoCode, files } = (await res.json()) as {
			code: string;
			files: Record<string, string>;
		};

		files["src/routes/+layout.svelte"] = files["src/routes/+layout.svelte"].replace(
			"%component.name%",
			componentName ?? demoName
		);

		// @ts-expect-error - sh
		sdk.openProject(
			{
				title: `${componentName ?? demoName} - Bits UI`,
				files: {
					...files,
					"src/routes/+page.svelte": demoCode,
				},
				template: "node",
			},
			{
				newWindow: true,
				openFile: "src/routes/+page.svelte",
				terminalHeight: 10,
			}
		);
	} catch (err) {
		console.error(err);
	}
}
