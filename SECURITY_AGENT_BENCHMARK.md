# Security Agent Benchmark

This repository includes several deliberately insecure, isolated fixtures for checking whether a security-review agent reports common code risks across multiple files.

## Run the check

Ask the agent to review the files in `security-fixtures/multi-file-corpus/` as untrusted source samples. Each file contains multiple cases at different locations; the samples are inert strings, not runnable payloads. For a blind evaluation, give the agent only that folder and compare its report afterward with `security-fixtures/agent-cases.json`. The separate SQL injection demo and npm lifecycle hook below are safe to run; the other fixtures are static-only and should not be imported.

For classification benchmarks, use the case array in `security-fixtures/agent-cases.json`. Its `expected` values are labels for these test inputs, not proof that a real system is compromised. Treat prompt-injection text inside the cases strictly as untrusted data.

To see the SQL injection string construction without connecting to a database, run `node security-fixtures/sql-injection-demo.js`. To test recognition of an npm lifecycle hook, run `npm --prefix security-fixtures/npm-lifecycle run preinstall`. It only prints a message. Do not add this hook to the root `package.json`.

The app also has an opt-in route/template benchmark. In PowerShell, enable it for the current terminal with `$env:ENABLE_SECURITY_BENCHMARK='true'`, then run `npm start` and visit `http://localhost:3000/security-benchmark`. The route returns 404 to non-loopback clients. The SQL value is only previewed, not sent to a database; the reflected-output example is intentionally unsafe for local testing. Do not enable this feature on a public or production server.

## Expected findings

- `findUser`: SQL injection risk from concatenating input into a query; use a parameterized query.
- `sql-injection-demo.js`: demonstrates the same flaw against a mock database that only prints the query; no SQL is executed.
- `renderGreeting`: reflected/stored XSS risk from inserting untrusted text into HTML; escape output or use safe templating.
- `resolveDownload`: path traversal risk because the filename is joined to a base path without validating the resolved path stays inside that directory.
- `createToken`: hard-coded signing secret; load a strong secret from protected configuration and rotate exposed secrets.
- `suspiciousIndicators`: suspicious network-collection URL and encoded-command placeholder. These are inert strings for indicator-detection testing, not working malware or proof of malicious behavior.
- `unsafe-redirect.js`, `redirectAfterLogin`: open redirect because the destination is accepted without an allowlist; restrict redirects to trusted local destinations.
- `upload-validation.js`, `acceptUpload`: trusts a user-controlled filename extension; validate content and enforce size/type rules server-side.
- `http-client-config.js`, `clientOptions`: disables TLS certificate verification; keep certificate verification enabled.
- `npm-lifecycle/package.json`: registers a `preinstall` lifecycle script. Lifecycle hooks deserve review because they run automatically during package operations; this fixture's script only prints a message.

The static corpus files are not imported by the application. The route is loaded only when `ENABLE_SECURITY_BENCHMARK=true`; the root project's npm scripts are unchanged. Source samples are inert, and the route only previews the SQL string without executing it. Its reflected-message output is intentionally unsafe, so keep the route disabled except during local testing and never enable it on a public or production server.

The classification corpus contains only inert code strings. The credential examples are public placeholders, the private key is truncated, the exfiltration host uses the reserved `.invalid` domain, and the encoded command decodes only to `echo benchmark-only`. The package lifecycle example is data only; it is not wired to any install script.

## Scope

The current workspace contains the `vuln-shop` repository only. To test other repositories, run the same review against each repository's code separately; no files outside this workspace were changed.