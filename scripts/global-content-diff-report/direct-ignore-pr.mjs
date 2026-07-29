const SOURCE_IDENTITY_PATTERN = /^(documentation|news):(cnt_\d+)$/;
const POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/;

function parseSourceIdentity(sourceIdentity) {
  const match = SOURCE_IDENTITY_PATTERN.exec(sourceIdentity);
  if (!match) {
    throw new Error("Invalid source_identity; expected exact composite identity like news:cnt_000177");
  }
  return { sourceSection: match[1], sourceId: match[2] };
}

function identityBranchPrefix(sourceSection, sourceId) {
  return `global-content-diff-ignore/${sourceSection}-${sourceId}`;
}

function trustedMarker(sourceIdentity, sourceSection, sourceId) {
  return `<!-- global-content-diff-ignore:v1 {"sourceSection":"${sourceSection}","sourceId":"${sourceId}","sourceIdentity":"${sourceIdentity}"} -->`;
}

function isSupportedIdentityBranch(value, prefix) {
  if (typeof value !== "string") return false;
  if (value === prefix) return true;
  return new RegExp(`^${prefix}-[1-9]\\d*-[1-9]\\d*$`).test(value);
}

export function buildDirectIgnoreBranch({ sourceIdentity, runId, runAttempt }) {
  const { sourceSection, sourceId } = parseSourceIdentity(sourceIdentity);
  if (typeof runId !== "string" || !POSITIVE_INTEGER_PATTERN.test(runId)) throw new Error("GitHub run ID must be a positive integer string");
  if (typeof runAttempt !== "string" || !POSITIVE_INTEGER_PATTERN.test(runAttempt)) throw new Error("GitHub run attempt must be a positive integer string");
  return `${identityBranchPrefix(sourceSection, sourceId)}-${runId}-${runAttempt}`;
}

export function findReusableDirectIgnorePullRequests({ pages, repository, sourceIdentity }) {
  const { sourceSection, sourceId } = parseSourceIdentity(sourceIdentity);
  if (typeof repository !== "string" || repository.length === 0) throw new Error("GitHub repository is required");
  if (!Array.isArray(pages) || pages.some((page) => !Array.isArray(page))) {
    throw new Error("Expected paginated GitHub pull request arrays");
  }

  const expectedRepository = repository.toLowerCase();
  const expectedMarker = trustedMarker(sourceIdentity, sourceSection, sourceId);
  const expectedBranchPrefix = identityBranchPrefix(sourceSection, sourceId);

  return pages.flatMap((page) => page).filter((pr) => {
    if (pr === null || typeof pr !== "object") return false;
    const headRepository = pr.head?.repo?.full_name;
    return typeof headRepository === "string"
      && headRepository.toLowerCase() === expectedRepository
      && isSupportedIdentityBranch(pr.head?.ref, expectedBranchPrefix)
      && typeof pr.body === "string"
      && pr.body.includes(expectedMarker)
      && typeof pr.html_url === "string"
      && pr.html_url.length > 0;
  }).map((pr) => ({
    url: pr.html_url,
    headRefName: pr.head.ref,
  }));
}

export function classifyReusableDirectIgnorePullRequests(matches) {
  if (!Array.isArray(matches)) throw new Error("Direct Ignore PR matches must be an array");
  if (matches.length === 0) return { kind: "create", match: null, count: 0 };
  if (matches.length === 1) return { kind: "reuse", match: matches[0], count: 1 };
  return { kind: "duplicate", match: null, count: matches.length };
}
