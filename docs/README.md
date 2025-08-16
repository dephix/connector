# Connector Monorepo Documentation

This documentation describes the services contained in this monorepo, their responsibilities, message contracts, and operational aspects.

- See `services/` for per‑service documentation
- See `../ops/` for infrastructure and observability stack

## Release policy

We version the monorepo using Semantic Versioning (SemVer) and create Git tags:

- Patch (x.y.Z): bug fixes or CI/docs only changes
- Minor (x.Y.z): backward‑compatible features (e.g., new endpoints, subjects)
- Major (X.y.z): breaking changes (protocol/subjects, envs, config semantics)

Cutting a release:

1. Update `package.json` version
2. Commit the bump with a message `chore(release): vX.Y.Z`
3. Create a tag `vX.Y.Z`
4. Push branch and tag to GitHub

CI will run tests and attach the coverage artifact. Optionally, you can add a GitHub Release entry pointing to the tag and paste highlights (no binaries are required since these are services). Deployment can be handled by your platform (Docker images, Helm, etc.) and should track the tag.

## Components

See component diagram of services/ports in `architecture/components.md`.
