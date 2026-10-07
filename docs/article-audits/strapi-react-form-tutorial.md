# React contact-form tutorial: source and contract audit

Checked on 2026-10-07 against the local `strapi-forms` and `formflow-sdk`
repositories. Plugin package version: 1.5.0. Core and React SDK package versions:
1.0.5. These are checkout versions, not a verification of the latest npm release.

Article: `src/content/blog/tutorials/strapi-react-form-tutorial/index.mdx`.

## Result

No invented SDK exports, prop getters, plugin settings, field types or endpoints
were found. The code example uses the actual public schema and submission
contracts. Each concern belongs to its appropriate layer: Strapi owns settings,
validation and persistence; the SDK owns schema fetching, input bindings and
request serialization; the tutorial supplies the React page and styling hooks.

The second review clarified the exact admin layout label, activation sequence,
automatic publishing on save, and the Next.js client-component boundary.

## Claim-to-source checklist

Paths below are relative to the named repository.

| Article claim | Plugin evidence (`strapi-forms`) | SDK evidence (`formflow-sdk`) |
| --- | --- | --- |
| Installable package names and Strapi v5 / React 18 compatibility | `package.json`: package name, Strapi peer dependency and plugin ID | `packages/core/package.json`, `packages/react/package.json`: names; React peer dependency `>=18` |
| Plugin owns form and submission content types | `server/src/content-types/index.ts`; form and form-submission `schema.json` files | `packages/core/src/types.ts`: public form/submission types; SDK doesn't create database tables |
| Required text, email and textarea fields | `server/src/services/form.ts:623` (`getFieldTypes`); `server/src/services/validation.ts` | `packages/core/src/types.ts`; `packages/core/src/validation.ts` |
| Field names are JSON value keys | `server/src/services/submission.ts:261`; `server/src/services/validation.ts` | `packages/core/src/serialize.ts:68`; `packages/react/src/FormFlowField.tsx` |
| UI layout label is Single page; API value is `single` | `admin/src/components/FormSettings/index.tsx:378`; `server/src/services/form.ts:603` | `packages/core/src/types.ts`; store single-layout behavior |
| Active switch, success message and submit-button text exist | `admin/src/pages/FormEditPage.tsx:601`; `admin/src/components/FormSettings/index.tsx:181` and `:278` | `packages/core/src/types.ts`; submission result and schema settings are consumed by React |
| Saving creates/updates the published form | `server/src/services/form.ts:257` and `:304`, both use `status: 'published'` | SDK consumes the published public schema; it doesn't publish forms |
| Public access requires a published, active form | `server/src/services/form.ts:233`; `server/src/policies/is-form-active.ts:41` | `packages/core/src/client.ts`: failed requests become SDK errors |
| GET schema and POST submit routes are real | `server/src/routes/content-api/index.ts` | `packages/core/src/constants.ts`; `packages/core/src/client.ts` |
| Schema response is `{ data: schema }`; private notification/captcha secrets are omitted | `server/src/controllers/public.ts:88`; `server/src/services/form.ts:523` | `packages/core/src/client.ts`: envelope unwrapping; `packages/core/src/types.ts` |
| SDK base URL is an origin; default prefix is `/api/formflow` | Content-API route mount and plugin ID | `packages/core/src/constants.ts:10`; `packages/core/src/client.ts:135` |
| `createFormFlowClient`, `getForm`, AbortSignal and injected fetch exist | Plugin supplies the HTTP schema endpoint | `packages/core/src/index.ts`; `packages/core/src/client.ts` options and `getForm` implementation |
| React provider, hook, field and honeypot components are exported | Public field/spam schema supports their input data | `packages/react/src/index.tsx`; corresponding component files |
| Input/textarea/label/description/error prop getters exist | Plugin exports field labels, descriptions, types and required flags | `packages/react/src/useFormFlowField.ts:92`; implementation from `:187` |
| Email input type must be explicitly supplied | `email` field type and server email validator | `getInputProps()` has no inferred `type`; tutorial passes `type: 'email'` |
| SDK validates on blur and before submission | Server independently validates before persistence | `packages/core/src/store.ts:315` and `:481`; React blur handler in `useFormFlowField.ts` |
| Field errors have ARIA wiring; controls expose state attributes | Server field errors are keyed by name | `packages/react/src/useFormFlowField.ts:154`, `:161`, `:289` |
| `getFormProps()` disables native validation; submit errors use `form.state.submitError` | Controller validation-error envelope | `packages/react/src/useFormFlow.ts:118`; `packages/core/src/store.ts:544` |
| Flat JSON body; empty `_gotcha` sent but not stored | `server/src/services/submission.ts`: honeypot removal and stored data | `packages/core/src/serialize.ts:68`; `constants.ts`: `_gotcha` |
| Filled honeypot returns success without storing a submission | `server/src/middlewares/spam-check.ts:175` | `packages/react/src/FormFlowHoneypot.tsx`; serializer honeypot handling |
| Invalid email produces a field error and HTTP 400 | `server/src/services/validation.ts:475`; `server/src/controllers/public.ts:305` | `packages/core/src/validation.ts:253`; `errors.ts`; store merges server field errors |
| Configured submission rate limit can return HTTP 429 | `server/src/policies/rate-limit.ts:237`; submit route policy | `packages/core/src/errors.ts`: rate-limit error parsing |
| Layout fields are excluded from `form.fields` | `server/src/services/form.ts` (`getFieldTypes`) defines heading, paragraph, divider | `packages/core/src/constants.ts`; `store.ts:237`; `useFormFlow.ts` |
| Select, checkbox, radio and file prop getters exist | `server/src/services/form.ts` (`getFieldTypes`), validation and multipart upload handling | `packages/react/src/useFormFlowField.ts`; `packages/core/src/serialize.ts` |
| Files trigger multipart when a visible file field holds real File values | Submit route accepts multipart and processes files | `packages/core/src/serialize.ts:77`; client multipart request handling |
| Multi-step and captcha APIs exist, but are outside this walkthrough | Step-aware submit controller; spam middleware verifies provider tokens | `packages/react/src/FormFlowStep.tsx`; `useFormFlow.ts:66`; SDK token constants |
| Broader React Vite example exists | Consumes plugin public API | `examples/react-vite/src/App.tsx` and `FormView.tsx` |
| React adapter ships no CSS | Styling is a frontend concern | React package exports/build inputs and `sideEffects: false`; no CSS import in adapter |

## Verification boundary

- Rebuilt the core and React SDK packages from the current checkout.
- This pass completed 6 article interaction tests and 83 existing core SDK tests;
  all 89 passed. TypeScript and the plugin contract checks also passed.
- Typechecked the exact React snippets extracted from the final article, with
  Vite environment declarations provided by the verification harness.
- Exercised the exact snippets with a public schema produced by the real plugin
  controller/service. Tests cover Strict Mode loading, required/invalid email,
  the flat submit payload, success, network failure, schema-load failure, and
  mapping a plugin-shaped server validation response back to the email field.
- Exercised the real plugin controller, validation and submission services,
  honeypot middleware, active/published policy and rate-limit policy. Persistence
  used mocked Strapi Document Service storage; this is not a real database test.
- Checked the article's code against relevant existing SDK store, client,
  validation and serialization tests.
- Rebuilt the website after the wording corrections.

The Strapi browser harness, clean npm installation, real database writes,
Next.js/Astro applications, captcha widgets, uploads and multi-step forms were
not run in this audit. Their existence was checked in source; this article's
working example is limited to the three-field Vite + React contact form.
