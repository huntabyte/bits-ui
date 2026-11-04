/**
 * Compact GitHub changelog functions for changesets.
 *
 * Local fork of `@svitejs/changesets-changelog-github-compact` (unmaintained).
 * Emits `- summary ([#123](pr-url))` instead of the default
 * `- [#123] [`sha`] Thanks [@user]! - summary`.
 *
 * `@changesets/cli` 3 `import()`s this file directly from `.changeset/config.json`;
 * Node strips the types at load time.
 */
import {
	getCommitInfo,
	getPullRequestInfo,
	type CommitInfo,
	type PullRequestInfo,
} from "@changesets/get-github-info";

const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;
const ISSUE_HINT_PATTERN = /(?<=\( ?(?:fix|fixes|see) )(#\d+)(?= ?\))/g;
const PR_HEADER_PATTERN = /^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im;
const COMMIT_HEADER_PATTERN = /^\s*commit:\s*([^\s]+)/im;
const AUTHOR_HEADER_PATTERN = /^\s*(?:author|user):\s*@?([^\s]+)/gim;

const CONFIG_HINT =
	'Please provide a repo to this changelog generator like this:\n"changelog": ["../scripts/changelog-github-compact.ts", { "repo": "org/repo" }]';

/**
 * Thrown when `.changeset/config.json` is missing a valid `{ repo }` option.
 */
export class ChangelogConfigError extends Error {
	readonly _tag = "ChangelogConfigError";

	constructor(message: string) {
		super(message);
		this.name = "ChangelogConfigError";
	}
}

/**
 * Parsed changelog plugin options from `.changeset/config.json`.
 */
export type ChangelogOptions = {
	readonly repo: string;
};

/**
 * Markdown links returned for a commit or pull request.
 */
export type GitHubLinks = {
	readonly commit: string | null;
	readonly pull: string | null;
	readonly user: string | null;
};

/**
 * GitHub metadata used to suffix a changelog line.
 */
export type GitHubInfo = {
	readonly links: GitHubLinks;
};

/**
 * Looks up PR/commit markdown links. Production uses `@changesets/get-github-info`.
 */
export type GitHubInfoLookup = {
	getInfo(request: { repo: string; commit: string }): Promise<GitHubInfo>;
	getInfoFromPullRequest(request: { repo: string; pull: number }): Promise<GitHubInfo>;
};

/**
 * Changeset fields this plugin reads when formatting a release line.
 */
export type ChangelogChangeset = {
	readonly summary: string;
	readonly commit?: string;
};

/**
 * A workspace dependency bump recorded by changesets.
 */
export type ChangelogDependencyUpdate = {
	readonly name: string;
	readonly newVersion: string;
};

/**
 * The two functions `@changesets/cli` calls while writing `CHANGELOG.md`.
 */
export type ChangelogFunctions = {
	getReleaseLine(
		changeset: ChangelogChangeset,
		type: "major" | "minor" | "patch" | "none",
		options: unknown
	): Promise<string>;
	getDependencyReleaseLine(
		changesets: ReadonlyArray<ChangelogChangeset>,
		dependenciesUpdated: ReadonlyArray<ChangelogDependencyUpdate>,
		options: unknown
	): Promise<string>;
};

/**
 * Parses changeset changelog options. `repo` must be `org/repo`.
 *
 * @throws {ChangelogConfigError} When `options` is missing or `repo` is invalid.
 */
export function parseChangelogOptions(options: unknown): ChangelogOptions {
	if (typeof options !== "object" || options === null || !("repo" in options)) {
		throw new ChangelogConfigError(CONFIG_HINT);
	}
	const repo = options.repo;
	if (typeof repo !== "string" || !REPO_PATTERN.test(repo)) {
		throw new ChangelogConfigError(
			`Please provide a valid GitHub repository in the form of org/repo (got ${JSON.stringify(repo)})`
		);
	}
	return { repo };
}

/**
 * Builds changelog functions that suffix each line with a PR or commit link.
 *
 * @param github - Lookup used for PR/commit markdown. Inject a fake in tests.
 */
export function createChangelogFunctions(github: GitHubInfoLookup): ChangelogFunctions {
	return {
		async getReleaseLine(changeset, _type, options) {
			const { repo } = parseChangelogOptions(options);
			const parsed = parseSummary(changeset.summary);
			const [firstLine = "", ...futureLines] = parsed.body
				.split("\n")
				.map((line) => linkifyIssueHints(repo, line.trimEnd()));
			const links = await resolveLinks(github, repo, parsed, changeset.commit);
			const suffix = links.pull
				? ` (${links.pull})`
				: links.commit
					? ` (${links.commit})`
					: "";
			const rest = futureLines.map((line) => (line ? `  ${line}` : "")).join("\n");
			return `\n- ${firstLine}${suffix}\n${rest}`;
		},
		async getDependencyReleaseLine(changesets, dependenciesUpdated, options) {
			const { repo } = parseChangelogOptions(options);
			if (dependenciesUpdated.length === 0) {
				return "";
			}
			const commitLinks = (
				await Promise.all(
					changesets.map(async (changeset) => {
						if (!changeset.commit) {
							return undefined;
						}
						const info = await github.getInfo({
							repo,
							commit: changeset.commit,
						});
						return info.links.commit;
					})
				)
			).filter((link): link is string => link !== undefined && link !== null);
			const header =
				commitLinks.length > 0
					? `- Updated dependencies [${commitLinks.join(", ")}]:`
					: "- Updated dependencies:";
			const lines = dependenciesUpdated.map(
				(dependency) => `  - ${dependency.name}@${dependency.newVersion}`
			);
			return [header, ...lines].join("\n");
		},
	};
}

/** Changeset changelog functions wired to `@changesets/get-github-info`. */
const changelogFunctions = createChangelogFunctions({
	async getInfo(request) {
		return toGitHubInfo(await getCommitInfo(request));
	},
	async getInfoFromPullRequest(request) {
		return toGitHubInfo(await getPullRequestInfo(request));
	},
});

export default changelogFunctions;

type ParsedSummary = {
	readonly body: string;
	readonly pr: number | undefined;
	readonly commit: string | undefined;
};

function parseSummary(summary: string): ParsedSummary {
	let pr: number | undefined;
	let commit: string | undefined;
	const body = summary
		.replace(PR_HEADER_PATTERN, (_match, raw: string) => {
			const parsed = Number(raw);
			if (!Number.isNaN(parsed)) {
				pr = parsed;
			}
			return "";
		})
		.replace(COMMIT_HEADER_PATTERN, (_match, value: string) => {
			commit = value;
			return "";
		})
		.replace(AUTHOR_HEADER_PATTERN, "")
		.trim();
	return { body, pr, commit };
}

function linkifyIssueHints(repo: string, line: string): string {
	return line.replace(ISSUE_HINT_PATTERN, (issueHash) => {
		return `[${issueHash}](https://github.com/${repo}/issues/${issueHash.slice(1)})`;
	});
}

async function resolveLinks(
	github: GitHubInfoLookup,
	repo: string,
	parsed: ParsedSummary,
	changesetCommit: string | undefined
): Promise<GitHubLinks> {
	if (parsed.pr !== undefined) {
		const { links } = await github.getInfoFromPullRequest({ repo, pull: parsed.pr });
		if (parsed.commit === undefined) {
			return links;
		}
		return {
			...links,
			commit: `[\`${parsed.commit.slice(0, 7)}\`](https://github.com/${repo}/commit/${parsed.commit})`,
		};
	}
	const commit = parsed.commit ?? changesetCommit;
	if (commit === undefined) {
		return { commit: null, pull: null, user: null };
	}
	const { links } = await github.getInfo({ repo, commit });
	return links;
}

/** Missing commits or PRs resolve to `undefined`, which leaves the line unsuffixed. */
function toGitHubInfo(info: CommitInfo | PullRequestInfo | undefined): GitHubInfo {
	return {
		links: {
			commit: info?.commit?.markdownLink ?? null,
			pull: info?.pull?.markdownLink ?? null,
			user: info?.author?.markdownLink ?? null,
		},
	};
}
