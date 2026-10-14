# Headless form builder API guide: source and contract audit

Reviewed 2026-10-14. Plugin checkout `a9f2204`, version 1.5.0; SDK checkout
`5d7b4fa`, core/React/Vue versions 1.0.5. These are the local tested checkouts;
latest npm releases and a clean registry installation were not verified.

Article: `src/content/blog/guides/headless-form-api-contract/index.mdx`.

## Editorial and SEO decisions

The user-provided Search Console export informed the topic wording. The article
keeps its API architecture intent and uses “headless form builder” near the
start of its H1, SEO title and opening. The API modifier is an editorial
hypothesis, not a search query established by the export. No ranking, CTR or
traffic improvement is claimed. Raw export data and performance metrics remain
in the internal marketing repository and are not part of this public commit.

The article links to the React implementation and backend operations guides,
uses actual HTTP/JSON/SDK examples, and separates identity, transport,
visibility, errors, draft/step/final behavior and framework bindings. This is a
concept guide, not a new installation tutorial or pricing page. No HowTo/FAQ
structured data is added.

## Corrections and qualifications

- Public field `order` values are exposed; the projection is not described as
  automatically sorting the array.
- Field IDs and submission names are distinct. Renaming a payload key is not
  automatically backward compatible.
- Request JSON is flat, while successful responses use a data envelope.
- Multipart values and parsed files are passed separately to the service;
  ordinary and file rules are applied before storage.
- The low-level client serializes but does not perform store validation.
- The React input getter requires an explicit email type. The example includes
  its import, provider requirement and matching description element.
- Step checks validate without persistence; partial saves sanitize incomplete
  data and can retain hidden values.
- **Current resumed-submit behavior:** loading a draft followed by the ordinary
  SDK submit creates a new final record. The original draft isn't automatically
  promoted or deleted. No unsupported finalization or token-expiry guarantee
  is described.
- Save & resume requires entitlement; SDK methods do not grant it.
- Error codes reflect actual statuses. An unavailable form can be stopped by a
  route policy; the article doesn't promise HTTP 404 for every such request.
- Honeypot fake success is distinguished from real persistence.

## Claim-to-source evidence

Paths are relative to the named repositories.

| Claim | Plugin (`strapi-forms`) | SDK (`formflow-sdk`) |
| --- | --- | --- |
| Curated public schema; private settings omitted | `server/src/services/form.ts:getPublicSchema`; `controllers/public.ts:getFormSchema` | `packages/core/src/types.ts`; `client.ts:getForm` unwraps the envelope |
| Published/active availability guard | `services/form.ts:findBySlug`; `policies/is-form-active.ts`; content-api routes | Client status-based error parser |
| IDs generated at creation; names used as value keys | `services/form.ts:create`; `services/submission.ts:submit` | Field bindings by name; serializer indexes values by `field.name` |
| Step definitions reference configured field identities | `services/submission.ts:resolveStep`, `validateStep`; validation subset code | `packages/core/src/types.ts:FormStep`; store step handling |
| GET/POST/partial URLs and default prefix | `server/src/routes/content-api/index.ts`; plugin ID | `packages/core/src/constants.ts`; `client.ts` |
| Low-level submit serialization without store validation | Server validates regardless of client path | `client.ts:submit`; validation runs separately in `store.ts:submit` |
| Flat JSON; multipart for visible file values; repeated array keys | Public controller separates body/files; submission validation/upload | `packages/core/src/serialize.ts`; `client.ts` selects transport |
| File-only forms can submit an empty text body | `controllers/public.ts:submitForm`; `services/submission.ts:processFileUploads` | File serialization tests |
| Authoritative hidden-field removal | `services/submission.ts:submit`; `utils/validation-rules.ts` | `conditional.ts`, `serialize.ts`, `store.ts` |
| Partial saves preserve hidden values without final validation/uploads/hooks | `services/submission.ts:savePartial`; `controllers/public.ts:savePartialForm` | `client.ts:savePartial`, `loadPartial`; store restore methods |
| Normal resumed submit creates a new final row | `services/submission.ts:submit` creates a record independently of drafts | `store.ts:submit` doesn't pass resumeToken in its payload |
| Step checks don't persist | `controllers/public.ts` `_step` branch; `services/submission.ts:validateStep` | `client.ts:validateStep`; optional server step validation in the store |
| Partial endpoints are entitlement gated | `services/submission.ts:savePartial/getPartial`; controller HTTP 402 branches | `errors.ts` maps 402 to `payment_required` |
| Field-error envelope and email message | `controllers/public.ts` validation response; `services/validation.ts` | `errors.ts:parseApiError`; store merges field errors |
| Status codes and Retry-After seconds | Rate-limit policy and controller/middleware statuses | `packages/core/src/errors.ts`; client transport errors |
| React uses external-store subscription; Vue exposes reactive refs | Public schema is the input | React `useFormFlowStore.ts`; Vue `use-store-state.ts`, `use-form-flow.ts` |
| Headless input/error/description wiring, explicit input type, no CSS bundle | Not server presentation APIs | `packages/react/src/useFormFlowField.ts`; Vue prop getters; package entrypoints |

## Verification

- Rebuilt core, React and Vue SDKs.
- Existing SDK tests: 129 passed (core 102, React 17, Vue 10); three optional live
  tests skipped because the real Strapi harness wasn't running.
- Plugin suites passed: no-key submission, conditional final-submission handling,
  and form entitlement/duplication contracts.
- Focused cross-repository harness used the actual core client with injected
  fetch dispatching to real plugin controller/service factories. It checked
  public secret omission, unwrapped schema, flat JSON with honeypot, email
  validation/error mapping, handcrafted hidden-value stripping, partial HTTP
  402/save/load, resumed-submit row creation, step checks without persistence,
  file-only upload and status/Retry-After mappings.
- Exact TypeScript and React snippets extracted from the article were typechecked
  and exercised in two additional tests: field type/ARIA/error wiring and
  low-level client serialization without local validation.

- Website build and SEO checks passed: title/H1, canonical, description, OG,
  BlogPosting/breadcrumb JSON-LD, heading anchors, image alt attributes, sitemap,
  blog index and Guides listing. Desktop/tablet/mobile checks at 1440/768/390
  pixels found no page-level horizontal overflow; the state table was reduced
  to two columns for narrow-screen readability.

The harness mocked Strapi Document Service persistence and the upload provider;
it wasn't a running HTTP server or a real database/upload test. The draft
uses those tested contracts but doesn't claim production-provider delivery,
all-field browser accessibility certification, or live Next.js/Nuxt verification.
