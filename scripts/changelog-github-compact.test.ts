import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	ChangelogConfigError,
	createChangelogFunctions,
	parseChangelogOptions,
	type GitHubInfo,
	type GitHubInfoLookup,
} from "./changelog-github-compact.ts";

const REPO = "huntabyte/bits-ui";
const OPTIONS = { repo: REPO };

function links(partial: Partial<GitHubInfo["links"]>): GitHubInfo {
	return {
		links: {
			commit: partial.commit ?? null,
			pull: partial.pull ?? null,
			user: partial.user ?? null,
		},
	};
}

function fakeGitHub(overrides?: Partial<GitHubInfoLookup>): GitHubInfoLookup {
	return {
		async getInfo({ commit }) {
			return links({
				commit: `[\`${commit.slice(0, 7)}\`](https://github.com/${REPO}/commit/${commit})`,
				pull: `[#2278](https://github.com/${REPO}/pull/2278)`,
			});
		},
		async getInfoFromPullRequest({ pull }) {
			return links({
				pull: `[#${pull}](https://github.com/${REPO}/pull/${pull})`,
				commit: `[\`abc1234\`](https://github.com/${REPO}/commit/abc1234)`,
			});
		},
		...overrides,
	};
}

describe("parseChangelogOptions", () => {
	it("returns the repo when present", () => {
		assert.deepEqual(parseChangelogOptions(OPTIONS), OPTIONS);
	});

	it("rejects missing or invalid repo values", () => {
		assert.throws(() => parseChangelogOptions(undefined), ChangelogConfigError);
		assert.throws(() => parseChangelogOptions({}), ChangelogConfigError);
		assert.throws(() => parseChangelogOptions({ repo: "not-a-repo" }), ChangelogConfigError);
		assert.throws(() => parseChangelogOptions({ repo: 1 }), ChangelogConfigError);
	});
});

describe("getReleaseLine", () => {
	it("suffixes the summary with a PR link and omits Thanks", async () => {
		const changelog = createChangelogFunctions(fakeGitHub());
		const line = await changelog.getReleaseLine(
			{ summary: "fix(Tooltip): keep the trigger mounted.", commit: "f9590a0fbfab" },
			"patch",
			OPTIONS
		);

		assert.equal(
			line,
			"\n- fix(Tooltip): keep the trigger mounted. ([#2278](https://github.com/huntabyte/bits-ui/pull/2278))\n"
		);
		assert.ok(!line.includes("Thanks"));
	});

	it("falls back to the commit link when there is no PR", async () => {
		const changelog = createChangelogFunctions(
			fakeGitHub({
				async getInfo({ commit }) {
					return links({
						commit: `[\`${commit.slice(0, 7)}\`](https://github.com/${REPO}/commit/${commit})`,
					});
				},
			})
		);
		const line = await changelog.getReleaseLine(
			{ summary: "fix: bump timestamps.", commit: "1a5fa52df5ac" },
			"patch",
			OPTIONS
		);

		assert.equal(
			line,
			"\n- fix: bump timestamps. ([`1a5fa52`](https://github.com/huntabyte/bits-ui/commit/1a5fa52df5ac))\n"
		);
	});

	it("omits a suffix when no commit or PR is available", async () => {
		const changelog = createChangelogFunctions(fakeGitHub());
		const line = await changelog.getReleaseLine(
			{ summary: "docs: mention snippets." },
			"patch",
			OPTIONS
		);
		assert.equal(line, "\n- docs: mention snippets.\n");
	});

	it("uses a PR number declared in the changeset summary", async () => {
		const changelog = createChangelogFunctions(fakeGitHub());
		const line = await changelog.getReleaseLine(
			{
				summary: "pr: #88\ncommit: deadbeefcafebabe\nfeat: expose a prop.",
				commit: "ignored",
			},
			"minor",
			OPTIONS
		);

		assert.equal(
			line,
			"\n- feat: expose a prop. ([#88](https://github.com/huntabyte/bits-ui/pull/88))\n"
		);
	});

	it("strips author headers and linkifies issue hints", async () => {
		const changelog = createChangelogFunctions(fakeGitHub());
		const line = await changelog.getReleaseLine(
			{
				summary: "author: @huntabyte\nfix the focus trap (fixes #12) and see (see #13).",
				commit: "abc1234",
			},
			"patch",
			OPTIONS
		);

		assert.equal(
			line,
			"\n- fix the focus trap (fixes [#12](https://github.com/huntabyte/bits-ui/issues/12)) and see (see [#13](https://github.com/huntabyte/bits-ui/issues/13)). ([#2278](https://github.com/huntabyte/bits-ui/pull/2278))\n"
		);
	});

	it("indents additional summary lines", async () => {
		const changelog = createChangelogFunctions(
			fakeGitHub({
				async getInfo() {
					return links({});
				},
			})
		);
		const line = await changelog.getReleaseLine(
			{ summary: "feat: add a component.\n\nIncludes docs + tests." },
			"minor",
			OPTIONS
		);

		assert.equal(line, "\n- feat: add a component.\n\n  Includes docs + tests.");
	});
});

describe("getDependencyReleaseLine", () => {
	it("returns an empty string when nothing was updated", async () => {
		const changelog = createChangelogFunctions(fakeGitHub());
		assert.equal(await changelog.getDependencyReleaseLine([], [], OPTIONS), "");
	});

	it("lists updated dependencies under linked commits", async () => {
		const changelog = createChangelogFunctions(fakeGitHub());
		const line = await changelog.getDependencyReleaseLine(
			[{ summary: "unused", commit: "f9590a0fbfab" }],
			[{ name: "bits-ui", newVersion: "2.21.0" }],
			OPTIONS
		);

		assert.equal(
			line,
			"- Updated dependencies [[`f9590a0`](https://github.com/huntabyte/bits-ui/commit/f9590a0fbfab)]:\n  - bits-ui@2.21.0"
		);
	});
});

describe("changeset config entry", () => {
	it("default-exports the changelog functions named in .changeset/config.json", async () => {
		const config = await import("../.changeset/config.json", { with: { type: "json" } });
		assert.equal(config.default.changelog[0], "../scripts/changelog-github-compact.ts");
		const loaded = await import("./changelog-github-compact.ts");
		assert.equal(typeof loaded.default.getReleaseLine, "function");
		assert.equal(typeof loaded.default.getDependencyReleaseLine, "function");
	});
});
