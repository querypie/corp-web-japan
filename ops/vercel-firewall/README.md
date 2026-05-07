# Vercel WAF rules for `corp-web-japan`

This directory stores the repository-managed source of truth for the `corp-web-japan` Vercel WAF custom rule configuration.

Current project identifiers:

- Team slug: `querypie`
- Team ID: `team_8DsCdrF1uCfwY30OS8F8lREn`
- Project name: `corp-web-japan`
- Project ID: `prj_AwUz6ZAgq1YHmd1Vu025vFAekQYP`

Files:

- `corp-web-japan.firewall.json` — full firewall configuration payload for `PUT /v1/security/firewall/config`

## Intent

These rules are meant to cut down Vercel Runtime Log noise from obvious probe traffic that should be handled before requests reach the application runtime.

Important behavior note:

- The configured action is `deny`.
- Vercel Firewall deny returns `403 Forbidden` at the edge.
- The request does not reach the hosting runtime.
- This is intentional: the goal is to stop probe requests before they become runtime-visible `404` noise.

## Covered probe groups

The current file blocks these clusters:

1. Frontend/config discovery probes
   - `/runtime-config.js`
   - `/env.json`
   - `/config.json`
   - `/manifest.webmanifest`
   - `/swagger.json`
   - `/openapi.json`
   - `/firebase-config.json`
   - `/.well-known/jwks.json`
2. API/health endpoint probes
   - `/api/v1/config`
   - `/api/v2/settings`
   - `/api/health`
   - `/health`
   - `/api/account`
3. Env/secret file probes
   - root `/.env*` via prefix rule `/.env`
   - `/backend/.env`
   - `/api/.env`
   - `/admin/.env`
   - `/config.env`
4. Exploit/scanner probes
   - `/wp-admin/*`
   - `/.git/*`
   - `/.ssh/*`

## Query the current live firewall config

Use the Vercel CLI API command:

```bash
vercel api '/v1/security/firewall/config/active?projectId=prj_AwUz6ZAgq1YHmd1Vu025vFAekQYP&teamId=team_8DsCdrF1uCfwY30OS8F8lREn' --scope querypie --raw | jq .
```

Notes:

- Before the first successful `PUT`, this endpoint can return `404 Config not found`.
- That `404` means there is no active custom firewall config yet, not that the project is missing.

To inspect recent firewall-side activity instead of runtime logs:

```bash
vercel api '/v1/security/firewall/events?projectId=prj_AwUz6ZAgq1YHmd1Vu025vFAekQYP&teamId=team_8DsCdrF1uCfwY30OS8F8lREn&limit=50' --scope querypie --raw | jq .
```

## Apply the repository-managed config

Apply the full source-of-truth JSON file with `PUT`:

```bash
vercel api '/v1/security/firewall/config?projectId=prj_AwUz6ZAgq1YHmd1Vu025vFAekQYP&teamId=team_8DsCdrF1uCfwY30OS8F8lREn' \
  --scope querypie \
  -X PUT \
  --input ops/vercel-firewall/corp-web-japan.firewall.json
```

Recommended workflow:

1. Query the active config and save it locally if you want a rollback snapshot.
2. Edit `corp-web-japan.firewall.json` in a branch.
3. Open and review a PR.
4. After merge, run the `PUT` command from a clean checkout of `main`.
5. Re-query the active config and verify the response matches the committed file.
6. Watch firewall events and confirm the targeted probe paths stop appearing as runtime `404` entries.

## Change the rules safely

Preferred method:

1. Edit `ops/vercel-firewall/corp-web-japan.firewall.json`.
2. Keep the whole file coherent as the authoritative config.
3. Review via PR.
4. Apply via the `PUT` command above.

Why this repo uses full-file `PUT` rather than ad hoc `PATCH`:

- `PUT` keeps one reviewable source of truth in git.
- `PATCH` is useful for emergency edits, but it is easier to drift away from the repository-managed config.

## Roll back to a previous file version

1. Check out the desired historical commit or restore the previous JSON file from git.
2. Re-run the same `PUT` command with that file.

Example:

```bash
git show <old-commit>:ops/vercel-firewall/corp-web-japan.firewall.json > /tmp/corp-web-japan.firewall.rollback.json
vercel api '/v1/security/firewall/config?projectId=prj_AwUz6ZAgq1YHmd1Vu025vFAekQYP&teamId=team_8DsCdrF1uCfwY30OS8F8lREn' \
  --scope querypie \
  -X PUT \
  --input /tmp/corp-web-japan.firewall.rollback.json
```

## Verify the local JSON file before apply

Check that the file is valid JSON:

```bash
jq . ops/vercel-firewall/corp-web-japan.firewall.json >/dev/null
```

## Caveats

- This file is a full config payload, not a partial patch.
- Applying it can overwrite dashboard-only custom WAF edits that are not reflected in git.
- If the site later intentionally serves one of the blocked paths, remove that path from this file before the next apply.
- The exploit/scanner rule uses path prefixes for `/wp-admin/`, `/.git/`, and `/.ssh/`, so it covers the concrete paths seen in logs and future variants under those namespaces.
- Managed rulesets and IP rules are intentionally empty in the current file. If they are later enabled in Vercel, update this file first so the next `PUT` does not remove them.
