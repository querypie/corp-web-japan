import { readFile } from "node:fs/promises";
import path from "node:path";

import { validateArtifact } from "./lib.mjs";
import { runPiInvocations } from "./pi-runner.mjs";

const REVIEW_TYPES = ["fidelity-review", "japanese-editorial-review", "contract-review"];

function dedupeFindings(findings) {
  const seen = new Set();
  const deduped = [];
  for (const finding of findings) {
    const key = JSON.stringify(finding);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(finding);
  }
  return deduped;
}

export async function readReviews(reportsDir) {
  const reviews = [];
  for (const type of REVIEW_TYPES) {
    const value = JSON.parse(await readFile(path.join(reportsDir, `${type}.json`), "utf8"));
    reviews.push(validateArtifact(type, value));
  }
  return reviews;
}

function resolveReviewBudget(options) {
  const maximumCorrectionRounds = Number(
    options.maximumCorrectionRounds
    ?? (options.maximumAttempts == null ? 5 : Math.max(Number(options.maximumAttempts) - 1, 0))
  );
  const totalAttempts = maximumCorrectionRounds + 1;
  return { maximumCorrectionRounds, totalAttempts };
}

export async function runReviewCycle(options) {
  let correctionFindings = [];
  const { maximumCorrectionRounds, totalAttempts } = resolveReviewBudget(options);
  for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
    await runPiInvocations({ ...options, correctionFindings, attempt });
    const reviews = await readReviews(options.reportsDir);
    const unresolved = dedupeFindings(reviews.flatMap((review) => {
      const actionable = review.findings.filter(({ severity }) => severity !== "note");
      if (actionable.length === 0) return [];
      return actionable.map((finding) => ({ review: review.artifactType, ...finding }));
    }));
    if (unresolved.length === 0) return { attempts: attempt, reviews };
    if (attempt === totalAttempts) throw new Error(`review correction limit reached after ${maximumCorrectionRounds} correction attempts: ${JSON.stringify(unresolved)}`);
    correctionFindings = dedupeFindings([...correctionFindings, ...unresolved]);
  }
  throw new Error("unreachable review cycle state");
}
