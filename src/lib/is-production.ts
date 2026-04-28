/**
 * Keep production detection aligned with corp-web-app.
 *
 * Rationale from corp-web-app PR #435:
 * - `VERCEL_TARGET_ENV` is the most accurate production signal on Vercel Hosting.
 * - Production detection should rely on the deployment target itself, not on branch-name heuristics.
 */
const isProduction = () => {
  return process.env.VERCEL_TARGET_ENV === 'production';
};

export default isProduction;
