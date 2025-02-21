import { stackblitzData } from "$lib/generated/stackblitz-data.js";
import sdk from "@stackblitz/sdk";

export async function openInStackBlitz(demoName: string) {
	try {
		const res = await fetch(`/api/demos?name=${demoName}`);
		if (!res.ok) {
			throw new Error("Failed to fetch demo code");
		}
		const { code: demoCode } = await res.json();

		sdk.default.openProject(
			{
				title: "Bits UI Demo",
				description: "Demo component for Bits UI",
				files: {
					...stackblitzData.files,
					"src/routes/+page.svelte": demoCode,
				},
				dependencies: stackblitzData.dependencies,
				template: "javascript",
			},
			{
				newWindow: true,
				openFile: "src/routes/+page.svelte",
				startScript: "pnpm dev",
			}
		);
	} catch (err) {
		console.error(err);
	}
}
