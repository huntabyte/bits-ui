/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// The scores are arranged so that a continuous match of characters will
// result in a total score of 1.
//
// The best case, this character is a match, and either this is the start
// of the string, or the previous character was also a match.
const SCORE_CONTINUE_MATCH = 1;
// A new match at the start of a word scores better than a new match
// elsewhere as it's more likely that the user will type the starts
// of fragments.
// NOTE: We score word jumps between spaces slightly higher than slashes, brackets
// hyphens, etc.
const SCORE_SPACE_WORD_JUMP = 0.9;
const SCORE_NON_SPACE_WORD_JUMP = 0.8;
// Any other match isn't ideal, but we include it for completeness.
const SCORE_CHARACTER_JUMP = 0.17;
// If the user transposed two letters, it should be significantly penalized.
//
// i.e. "ouch" is more likely than "curtain" when "uc" is typed.
const SCORE_TRANSPOSITION = 0.1;
// The goodness of a match should decay slightly with each missing
// character.
//
// i.e. "bad" is more likely than "bard" when "bd" is typed.
//
// This will not change the order of suggestions based on SCORE_* until
// 100 characters are inserted between matches.
const PENALTY_SKIPPED = 0.999;
// The goodness of an exact-case match should be higher than a
// case-insensitive match by a small amount.
//
// i.e. "HTML" is more likely than "haml" when "HM" is typed.
//
// This will not change the order of suggestions based on SCORE_* until
// 1000 characters are inserted between matches.
const PENALTY_CASE_MISMATCH = 0.9999;
// Match higher for letters closer to the beginning of the word
// If the word has more characters than the user typed, it should
// be penalized slightly.
//
// i.e. "html" is more likely than "html5" if I type "html".
//
// However, it may well be the case that there's a sensible secondary
// ordering (like alphabetical) that it makes sense to rely on when
// there are many prefix matches, so we don't make the penalty increase
// with the number of tokens.
const PENALTY_NOT_COMPLETE = 0.99;

const IS_GAP_REGEXP = /[\\/_+.#"@[({&]/;
const COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g;
const IS_SPACE_REGEXP = /[\s-]/;
const COUNT_SPACE_REGEXP = /[\s-]/g;

function computeCommandScoreInner(
	string,
	abbreviation,
	lowerString,
	lowerAbbreviation,
	stringIndex,
	abbreviationIndex,
	memoizedResults
) {
	if (abbreviationIndex === abbreviation.length) {
		if (stringIndex === string.length) return SCORE_CONTINUE_MATCH;
		return PENALTY_NOT_COMPLETE;
	}

	const memoizeKey = `${stringIndex},${abbreviationIndex}`;
	if (memoizedResults[memoizeKey] !== undefined) return memoizedResults[memoizeKey];

	const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex);
	let index = lowerString.indexOf(abbreviationChar, stringIndex);
	let highScore = 0;

	let score, transposedScore, wordBreaks, spaceBreaks;

	while (index >= 0) {
		score = computeCommandScoreInner(
			string,
			abbreviation,
			lowerString,
			lowerAbbreviation,
			index + 1,
			abbreviationIndex + 1,
			memoizedResults
		);
		if (score > highScore) {
			if (index === stringIndex) {
				score *= SCORE_CONTINUE_MATCH;
			} else if (IS_GAP_REGEXP.test(string.charAt(index - 1))) {
				score *= SCORE_NON_SPACE_WORD_JUMP;
				wordBreaks = string.slice(stringIndex, index - 1).match(COUNT_GAPS_REGEXP);
				if (wordBreaks && stringIndex > 0) {
					score *= PENALTY_SKIPPED ** wordBreaks.length;
				}
			} else if (IS_SPACE_REGEXP.test(string.charAt(index - 1))) {
				score *= SCORE_SPACE_WORD_JUMP;
				spaceBreaks = string.slice(stringIndex, index - 1).match(COUNT_SPACE_REGEXP);
				if (spaceBreaks && stringIndex > 0) {
					score *= PENALTY_SKIPPED ** spaceBreaks.length;
				}
			} else {
				score *= SCORE_CHARACTER_JUMP;
				if (stringIndex > 0) {
					score *= PENALTY_SKIPPED ** (index - stringIndex);
				}
			}

			if (string.charAt(index) !== abbreviation.charAt(abbreviationIndex)) {
				score *= PENALTY_CASE_MISMATCH;
			}
		}

		if (
			(score < SCORE_TRANSPOSITION &&
				lowerString.charAt(index - 1) ===
					lowerAbbreviation.charAt(abbreviationIndex + 1)) ||
			(lowerAbbreviation.charAt(abbreviationIndex + 1) ===
				lowerAbbreviation.charAt(abbreviationIndex) &&
				lowerString.charAt(index - 1) !== lowerAbbreviation.charAt(abbreviationIndex))
		) {
			transposedScore = computeCommandScoreInner(
				string,
				abbreviation,
				lowerString,
				lowerAbbreviation,
				index + 1,
				abbreviationIndex + 2,
				memoizedResults
			);

			if (transposedScore * SCORE_TRANSPOSITION > score) {
				score = transposedScore * SCORE_TRANSPOSITION;
			}
		}

		if (score > highScore) {
			highScore = score;
		}

		index = lowerString.indexOf(abbreviationChar, index + 1);
	}

	memoizedResults[memoizeKey] = highScore;
	return highScore;
}

/**
 *
 * @param string
 * @returns
 */
function formatInput(string) {
	// convert all valid space characters to space so they match each other
	return string.toLowerCase().replace(COUNT_SPACE_REGEXP, " ");
}

/**
 * Given a command, a search query, and (optionally) a list of keywords for the command,
 * computes a score between 0 and 1 that represents how well the search query matches the
 * abbreviation and keywords. 1 is a perfect match, 0 is no match.
 *
 * The score is calculated based on the following rules:
 * - The scores are arranged so that a continuous match of characters will result in a total
 * score of 1. The best case, this character is a match, and either this is the start of the string
 * or the previous character was also a match.
 * - A new match at the start of a word scores better than a new match elsewhere as it's more likely
 * that the user will type the starts of fragments.
 * - Word jumps between spaces are scored slightly higher than slashes, brackets, hyphens, etc.
 * - A continuous match of characters will result in a total score of 1.
 * - A new match at the start of a word scores better than a new match elsewhere as it's more likely that the user will type the starts of fragments.
 * - Any other match isn't ideal, but we include it for completeness.
 * - If the user transposed two letters, it should be significantly penalized.
 * - The goodness of a match should decay slightly with each missing character.
 * - Match higher for letters closer to the beginning of the word.
 *
 * @param command - The value to score against the search string (e.g. a command name like "Calculator")
 * @param search - The search string to score against the value/aliases
 * @param commandKeywords - An optional list of aliases/keywords to score against the search string - e.g. ["math", "add", "divide", "multiply", "subtract"]
 * @returns A score between 0 and 1 that represents how well the search string matches the
 * command (and keywords)
 */
export function computeCommandScore(
	command: string,
	search: string,
	commandKeywords?: string[]
): number {
	/**
	 * NOTE: We used to do lower-casing on each recursive call, but this meant that `toLowerCase()`
	 * was the dominating cost in the algorithm. Passing both is a little ugly, but considerably
	 * faster.
	 */
	command =
		commandKeywords && commandKeywords.length > 0
			? `${`${command} ${commandKeywords?.join(" ")}`}`
			: command;
	return computeCommandScoreInner(
		command,
		search,
		formatInput(command),
		formatInput(search),
		0,
		0,
		{}
	);
}
