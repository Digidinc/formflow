# Backend form guide: claim and contract audit

Reviewed on 2026-10-11 against the local FormFlow plugin and SDK source.
Plugin checkout: `a9f2204`, package version 1.5.0. SDK checkout: `5d7b4fa`,
core/React/Vue package versions 1.0.5. These identify the tested checkouts;
latest registry releases and a clean npm installation were not verified.

Article: `src/content/blog/guides/backend-behind-simple-form/index.mdx`.

## Changes from the internal draft

- Added a concrete contact-form example and a requirements/ownership table.
- Qualified label updates: clients must fetch the schema again; cached and
  pre-rendered pages need refresh or revalidation.
- Explained that adding a field type also requires renderer support, and a new
  required field can invalidate a stale client.
- Replaced the blanket implication that self-hosting prevents data leaving
  Strapi with explicit email, webhook/integration, upload and export paths.
- Distinguished persisted submissions from notification delivery.
- Clarified the free-core versus separately licensed feature boundary without
  introducing prices or sales-plan framing.
- Added internal links to the published React tutorial, unique SEO metadata,
  and a cover derived from the existing blog's illustration style.
- Kept the article as a concept guide; no HowTo or FAQ schema was added.

## Claim-to-source evidence

Paths below are relative to the named repositories.

| Claim | Plugin (`strapi-forms`) | SDK (`formflow-sdk`) / other source |
| --- | --- | --- |
| Forms and submitted data are managed inside Strapi | `server/src/content-types/`, `services/form.ts`, `services/submission.ts` | Core public schema types in `packages/core/src/types.ts` |
| Admin configuration is permission controlled | `server/src/register.ts`, `server/src/routes/admin/index.ts`; `admin/src/pages/FormEditPage.tsx` | Not an SDK responsibility |
| GET schema by slug; POST final submission; published/active guard | `server/src/routes/content-api/index.ts`, `policies/is-form-active.ts`, `services/form.ts:233` | `packages/core/src/client.ts`, `constants.ts` |
| Public projection omits notification configuration and captcha secrets | `server/src/services/form.ts:523` | SDK consumes that projection; checked through actual plugin controller |
| Label changes appear after a fresh schema fetch | `getPublicSchema` reads stored field labels | `client.getForm`; caching/revalidation qualification is architectural guidance |
| Renderer support is required for new field types | Field registry in `server/src/services/form.ts` | Renderless bindings in React/Vue adapters; example renderers branch by type |
| Server recalculates visibility and excludes hidden values | `server/src/services/submission.ts:296`, `utils/validation-rules.ts` | `packages/core/src/conditional.ts`, `serialize.ts`, `store.ts` |
| Required/type validation and file constraints run before upload/storage | `server/src/services/submission.ts:331`, `services/validation.ts`, `utils/validation-rules.ts` | `packages/core/src/validation.ts`, `file-rules.ts` |
| Accepted files use Strapi upload service; destination depends on its provider | `server/src/services/submission.ts:622` | Official Strapi [upload-provider documentation](https://docs.strapi.io/cms/configurations/media-library-providers) |
| Validation failures use HTTP 400 and field-name errors | `server/src/controllers/public.ts:305` | `packages/core/src/errors.ts`; `store.ts` merges server field errors |
| JSON payload is flat; visible file values trigger multipart | Submit route/controller accept both forms | `packages/core/src/serialize.ts`, `client.ts` |
| Honeypot fake success does not create a submission | `server/src/middlewares/spam-check.ts` | Serializer/honeypot components use matching `_gotcha` default |
| Rate limits are configured per form and IP | `server/src/policies/rate-limit.ts` | SDK parses rate-limit errors; limits aren't a submission quota |
| Notifications run after persisted final submission | `server/src/services/submission.ts:399`, `:475`, `:1017`; `services/email.ts` | No SDK delivery guarantee exists |
| Configured email/webhooks/integrations can forward submitted values | `triggerPostSubmissionHooks`, `services/email.ts`, webhook/integration services | Not an SDK storage/delivery responsibility |
| Telemetry is opt-out and excludes submitted values/labels/emails | `server/src/services/telemetry.ts`; privacy/opt-out tests; `README.md#telemetry` | No submission telemetry promise inferred from self-hosting |
| Submission status, bulk actions, deletion, CSV and JSON export exist | `controllers/submission.ts`, `services/submission.ts`, `services/export.ts`, admin routes | Not SDK administration APIs |
| React and Vue adapters provide headless state/ARIA bindings without CSS | Public field/settings contract | `packages/react/src/index.tsx`, `useFormFlowField.ts`; `packages/vue/src/index.ts`, `prop-getters.ts` |
| Core and SDKs are MIT; plugin EE is separately licensed | `LICENSE`, `LICENSE-EE`, `server/src/ee/feature-map.ts`, `utils/form-entitlements.ts` | SDK root/package MIT licenses |
| Core submission path works without a license key; basic exports work without an entitlement | No-key submission regression test; ungated CSV/JSON branches in submission export controller | Existing SDKs consume the ordinary public routes |
| Advanced conditional configuration, steps, webhooks, integrations, approval, retention and exports require entitlements | `server/src/ee/feature-map.ts`, `utils/form-entitlements.ts`, relevant controller/service gates | SDK support is not a license grant |

## Tests and validation

Passed:

- Second editorial pass matched the final article against the source checklist;
  no invented endpoints, SDK methods, settings or feature availability claims
  remained.
- Rebuilt the core, React and Vue SDK packages.
- All 129 SDK tests: core 102, React 17, Vue 10.
- Plugin suites: `test:unit`, `test:unit:conditional-submission`,
  `test:unit:form-entitlements`, `test:unit:telemetry`.
- Focused contract harness using actual plugin factories: public-schema secret
  omission, valid storage, invalid-email HTTP 400, honeypot stripping/fake
  success, active/published guard, rate limiting, CSV/JSON export without a
  license entitlement, one basic free email notification, and caught delivery
  failure after a row already exists.

- Website build and SEO checks passed: title, canonical, description, Open
  Graph, BlogPosting/breadcrumb schema, heading anchors, image alt attributes,
  sitemap, blog index and Guides category listing.
- Visually inspected the article at 1440, 768 and 390 CSS pixels; no page-level
  horizontal overflow, broken hero image or overflowing tables were found.

The focused harness uses mocked Strapi Document Service storage and notification
transport. It does not establish real database persistence or email delivery.
The three optional SDK live tests were skipped because the Strapi browser
harness was not running. Captcha widgets and external storage/integration
providers were checked in source/documentation, not exercised live.
