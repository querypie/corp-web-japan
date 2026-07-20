import { readFile } from "node:fs/promises";
import path from "node:path";

import { validateArtifact } from "./lib.mjs";
import { runPiInvocations } from "./pi-runner.mjs";

const REVIEW_TYPES = ["fidelity-review", "japanese-editorial-review", "contract-review"];

export async function readReviews(reportsDir) {
  const reviews = [];
  for (const type of REVIEW_TYPES) {
    const value = JSON.parse(await readFile(path.join(reportsDir, `${type}.json`), "utf8"));
    reviews.push(validateArtifact(type, value));
  }
  return reviews;
}

export async function runReviewCycle(options) {
  let correctionFindings = [];
  const maximumAttempts = Number(options.maximumAttempts || 5);
  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    await runPiInvocations({ ...options, correctionFindings, attempt });
    const reviews = await readReviews(options.reportsDir);
    const unresolved = reviews.flatMap((review) => {
      const actionable = review.findings.filter(({ severity }) => severity !== "note");
      if (actionable.length === 0) return [];
      return actionable.map((finding) => ({ review: review.artifactType, ...finding }));
    });
    if (unresolved.length === 0) return { attempts: attempt, reviews };
    if (attempt === maximumAttempts) throw new Error(`review correction limit reached after ${maximumAttempts} attempts: ${JSON.stringify(unresolved)}`);
    correctionFindings = unresolved;
  }
  throw new Error("unreachable review cycle state");
}
