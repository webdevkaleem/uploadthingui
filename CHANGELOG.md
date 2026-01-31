# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.4.0](https://github.com/webdevkaleem/uploadthingui/compare/v1.3.0...v1.4.0) (2026-01-31)


### Features

* enabled PostHog session replay, heatmaps, and tracing headers

### Bug Fixes

* added changelog notes ([edb15e1](https://github.com/webdevkaleem/uploadthingui/commit/edb15e15a7e22083dfeee794a7736e14c19cc404))
* posthog event analytics with the proper options added ([ea26b2f](https://github.com/webdevkaleem/uploadthingui/commit/ea26b2f2f280dd0433614ca34a836cb51668e00f))

## [1.3.0](https://github.com/webdevkaleem/uploadthingui/compare/v1.2.4...v1.3.0) (2026-01-30)

This release introduces major framework upgrades to React 19 and Next.js 16, bringing improved performance, new features, and enhanced developer experience, while requiring migration steps for existing implementations.

### Breaking Changes

* **React 19 Upgrade**: Upgraded from React 18 to React 19.2.4, which includes breaking changes to ref handling, hydration behavior, and component lifecycle. Components using deprecated React APIs or custom hydration logic may need updates. See [React 19 migration guide](https://react.dev/blog/2024/12/05/react-19) for details.

* **Next.js 16 Upgrade**: Upgraded from Next.js 15 to Next.js 16.1.6, introducing changes to async components, route handlers, and caching strategies. Server components and API routes may require updates to match the new async patterns. See [Next.js 16 upgrade guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-16) for migration steps.

* **Node.js Version Requirement**: Minimum Node.js version requirement increased to `>=20.9.0`. Projects running on Node.js 18 or earlier will need to upgrade their Node.js version before using this release.

### Notable Upgrades

* Upgraded to React 19.2.4 with improved concurrent rendering and performance optimizations
* Upgraded to Next.js 16.1.6 with enhanced caching, improved server components, and better TypeScript support
* Updated `@uploadthing/react` to ^7.3.1 and `uploadthing` to ^7.7.2 for latest features and bug fixes
* Updated `@docsearch/react` to ^4.5.3 for improved search functionality
* Enhanced TypeScript types with `@types/react` 19.2.10 and `@types/react-dom` 19.2.3

### Migration Guide

1. **Upgrade Node.js**: Ensure you're running Node.js 20.9.0 or higher. Check your version with `node --version` and upgrade if necessary.

2. **Update React Imports**: Review and update any deprecated React APIs. React 19 has stricter rules around refs and hydration.

3. **Next.js Async Patterns**: Update server components and route handlers to use the new async patterns required by Next.js 16. Ensure all `params`, `searchParams`, `cookies`, and `headers` are properly awaited.

4. **Test Thoroughly**: After upgrading, thoroughly test your application, especially:
   - Server-side rendering and hydration
   - API routes and server actions
   - Client-side interactions and state management
   - File upload functionality with UploadThing components

5. **Update Dependencies**: Run `pnpm install` (or your package manager's equivalent) to ensure all peer dependencies are compatible.

For detailed migration steps, refer to the [React 19 upgrade guide](https://react.dev/blog/2024/12/05/react-19) and [Next.js 16 upgrade guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-16).

## [1.2.4](https://github.com/webdevkaleem/uploadthingui/compare/v1.2.3...v1.2.4) (2025-06-20)


### Bug Fixes

* **docs:** fixed the breadcrumb links & better mobile side bar ([4e4de0a](https://github.com/webdevkaleem/uploadthingui/commit/4e4de0a2d86739dd474a9d4608df4ed8f3da3dae))

## [1.2.3](https://github.com/webdevkaleem/uploadthingui/compare/v1.2.2...v1.2.3) (2025-06-19)


### Bug Fixes

* **registry:** forgot to build the registry ([a6ae4ff](https://github.com/webdevkaleem/uploadthingui/commit/a6ae4ffd74436d42ba5b7322f336b87b358629fb))

## [1.2.2](https://github.com/webdevkaleem/uploadthingui/compare/v1.2.1...v1.2.2) (2025-06-19)


### Bug Fixes

* **registry:** added the versions back & space removed from readme ([09f9d35](https://github.com/webdevkaleem/uploadthingui/commit/09f9d35fe5800a6242b84284dfc0987e74ac0713))

## [1.2.1](https://github.com/webdevkaleem/uploadthingui/compare/v1.2.0...v1.2.1) (2025-06-19)


### Bug Fixes

* **route:** used posthog-node for server-side capture events ([c62e615](https://github.com/webdevkaleem/uploadthingui/commit/c62e615530785b77c7c6fdb2e20b37cd6d8f9c67))

## [1.2.0](https://github.com/webdevkaleem/uploadthingui/compare/v1.1.5...v1.2.0) (2025-06-19)


### Features

* **docs:** added product .capture events from posthog ([de34283](https://github.com/webdevkaleem/uploadthingui/commit/de34283c948143dd4c1a9f6759791b2130d0dcc4))

## [1.1.5](https://github.com/webdevkaleem/uploadthingui/compare/v1.1.4...v1.1.5) (2025-06-19)


### Bug Fixes

* **component:** removing internal styling ([eb828b9](https://github.com/webdevkaleem/uploadthingui/commit/eb828b938f37d5d71dc8511eeff8b45f1afbc18a))

## [1.1.4](https://github.com/webdevkaleem/uploadthingui/compare/v1.1.3...v1.1.4) (2025-06-19)


### Bug Fixes

* **components:** registry installation issue ([b379e9d](https://github.com/webdevkaleem/uploadthingui/commit/b379e9d4b2bb3a9a0b74fa4722df28ff5998489c))

## [1.1.3](https://github.com/webdevkaleem/uploadthingui/compare/v1.1.2...v1.1.3) (2025-06-12)


### Bug Fixes

* **docs:** corrected the urls from .com to .app ([c8a616d](https://github.com/webdevkaleem/uploadthingui/commit/c8a616df32597861fd8c23ccd4308cf15ee20487))

## [1.1.2](https://github.com/webdevkaleem/uploadthingui/compare/v1.1.1...v1.1.2) (2025-06-12)

## [1.1.1](https://github.com/webdevkaleem/uploadthingui/compare/v1.1.0...v1.1.1) (2025-06-12)


### Bug Fixes

* removing extra <hr/> from md files ([b8ae177](https://github.com/webdevkaleem/uploadthingui/commit/b8ae177f37a3192f639a3ec47d8341ecec5e24ad))

## 1.1.0 (2025-06-12)


### Features

* **project:** imported the project from private repo f4d3a52
