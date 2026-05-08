# @lomi./sdk version policy

This package follows [semver](https://semver.org/) (`MAJOR.MINOR.PATCH`).

- **PATCH** (`1.5.9` → `1.5.10`): backward-compatible fixes, docs, typings, or small additive helpers. Use this for most routine SDK releases.
- **MINOR** (`1.5.x` → `1.6.0`): new optional APIs or behavior that remains backward-compatible for existing callers.
- **MAJOR** (`1.x` → `2.0.0`): breaking changes (removed exports, changed defaults that affect integrations).

For incremental work shipped frequently, prefer **patch** bumps unless you introduce new surfaces or breaking changes.
