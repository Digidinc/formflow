import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Seo from '../components/seo/Seo';
import JsonLd from '../components/seo/JsonLd';
import { organizationSchema, websiteSchema } from '../lib/schema';
import { CHECKOUT_URLS, REPO_URL, SDK_REPO_URL, NPM_URL } from '../config/site';

/* ------------------------------------------------------------------ *
 * Data — single source of truth, hoisted to module scope.
 * Numbers and names mirror the published plugin + SDK packages.
 * ------------------------------------------------------------------ */

/**
 * Badge/gating labels used across the page. `agency` is a billing plan, not an
 * entitlement tier — it carries the Business feature set with an unlimited
 * activation quota — so it never appears as a field-gating value, only on a
 * pricing card. See ADR-0003 in the plugin repo.
 */
type Tier = 'free' | 'pro' | 'business' | 'agency';

const compat = ['Strapi 5', 'REST API', 'React', 'Vue', 'Next.js', 'Nuxt', 'Astro', 'Vite'];

// Real captures from a live FormFlow install, served from /public/shots.
const asset = (file: string) => `${import.meta.env.BASE_URL}shots/${file}`;
const gallery = [
  {
    file: 'builder.png',
    title: 'Drag-and-drop builder',
    body: '20+ field types, multi-step wizards, and conditional logic — without writing code.',
    alt: 'FormFlow form builder in the Strapi admin panel',
  },
  {
    file: 'inbox.png',
    title: 'Submission inbox',
    body: 'Statuses, bulk actions, and exports to CSV, JSON, Excel, and PDF.',
    alt: 'FormFlow submission inbox with status badges',
  },
  {
    file: 'integrations.png',
    title: 'Native integrations',
    body: 'Slack, Google Sheets, Mailchimp, HubSpot, Notion, Zapier, and Make.',
    alt: 'FormFlow integration picker showing connected services',
  },
  {
    file: 'forms-list.png',
    title: 'All forms in one place',
    body: 'Live submission counts and active status across every form.',
    alt: 'FormFlow forms list in the Strapi admin',
  },
];

const pipeline = [
  {
    kicker: 'Build',
    title: 'Design the form in Strapi',
    body: 'A visual builder with 20+ field types, layout blocks, conditional visibility, and multi-step wizards. Live preview, duplicate, reorder — no code.',
    tags: ['drag & drop', 'conditional logic', 'multi-step'],
  },
  {
    kicker: 'Validate',
    title: 'Catch bad input, both ends',
    body: 'Per-field rules with custom messages. The SDKs validate client-side against the same schema the server enforces, so nothing lands half-checked.',
    tags: ['per-field rules', 'client + server parity'],
  },
  {
    kicker: 'Protect',
    title: 'Stop spam without punishing people',
    body: 'Honeypot, rate limiting, and reCAPTCHA v2 ship free. Pro adds reCAPTCHA v3, Turnstile, hCaptcha, and IP blocklists.',
    tags: ['honeypot', 'rate limit', 'reCAPTCHA / Turnstile / hCaptcha'],
  },
  {
    kicker: 'Deliver',
    title: 'Route every submission where it belongs',
    body: 'Email notifications and autoresponders, HMAC-signed webhooks with retries, and pre-built integrations — fired the moment a row is saved.',
    tags: ['email', 'webhooks', 'Slack · Sheets · HubSpot · Notion'],
  },
  {
    kicker: 'Govern',
    title: 'Own the data after it arrives',
    body: 'A submission inbox with statuses and bulk actions, exports to CSV/JSON/Excel/PDF, analytics, plus GDPR retention, audit logs, and approvals.',
    tags: ['inbox', 'exports', 'GDPR + audit'],
  },
];

const fieldGroups: { label: string; fields: { name: string; tier: Tier }[] }[] = [
  {
    label: 'Text & contact',
    fields: [
      { name: 'text', tier: 'free' },
      { name: 'textarea', tier: 'free' },
      { name: 'email', tier: 'free' },
      { name: 'number', tier: 'free' },
      { name: 'phone', tier: 'free' },
      { name: 'url', tier: 'free' },
      { name: 'password', tier: 'free' },
    ],
  },
  {
    label: 'Choice & dates',
    fields: [
      { name: 'select', tier: 'free' },
      { name: 'radio', tier: 'free' },
      { name: 'checkbox', tier: 'free' },
      { name: 'boolean', tier: 'free' },
      { name: 'date', tier: 'free' },
      { name: 'time', tier: 'free' },
      { name: 'datetime', tier: 'free' },
    ],
  },
  {
    label: 'Files & layout',
    fields: [
      { name: 'file', tier: 'free' },
      { name: 'hidden', tier: 'free' },
      { name: 'heading', tier: 'free' },
      { name: 'paragraph', tier: 'free' },
      { name: 'divider', tier: 'free' },
    ],
  },
  {
    label: 'Advanced',
    fields: [
      { name: 'signature', tier: 'pro' },
      { name: 'rating / NPS', tier: 'pro' },
      { name: 'address + map', tier: 'pro' },
      { name: 'rich text', tier: 'pro' },
      { name: 'calculated', tier: 'pro' },
      { name: 'payment', tier: 'pro' },
    ],
  },
];

const sdks = [
  {
    name: '@formflowjs/core',
    tag: 'Framework-agnostic',
    install: 'npm i @formflowjs/core',
    body: 'The engine: TypeScript types for the content-API contract, a tiny fetch client, a schema-driven form store, client-side validation, conditional visibility, multi-step flow, uploads, and captcha plumbing. No framework, no CSS.',
    file: 'client.ts',
    lang: 'TypeScript',
    code: `import { createFormFlowClient } from '@formflowjs/core';

// Framework-agnostic: types + content-API client + form store.
const client = createFormFlowClient({
  baseUrl: 'https://cms.example.com',
});

// Fetch the sanitized, fully-typed schema by slug.
const schema = await client.getForm('contact-us');

// schema.fields, schema.settings, schema.steps — all typed.`,
  },
  {
    name: '@formflowjs/react',
    tag: 'React · Next.js · Astro',
    install: 'npm i @formflowjs/react',
    body: 'Headless hooks and renderless fields with ARIA-complete prop getters. SSR/RSC-safe via useSyncExternalStore, with a "use client" banner baked in for the App Router.',
    file: 'contact-form.tsx',
    lang: 'React',
    code: `import {
  FormFlowProvider, FormFlowField, useFormFlow,
} from '@formflowjs/react';

function Fields() {
  const f = useFormFlow();
  return (
    <form {...f.getFormProps()}>
      {f.fields.map((field) => (
        <FormFlowField key={field.name} name={field.name}
          render={(api) => (
            <label {...api.getLabelProps()}>
              {api.field.label}
              <input {...api.getInputProps()} />
              {api.invalid && <span>{api.error}</span>}
            </label>
          )} />
      ))}
      <button disabled={f.isSubmitting}>
        {f.schema.settings.submitButtonText}
      </button>
    </form>
  );
}`,
  },
  {
    name: '@formflowjs/vue',
    tag: 'Vue 3 · Nuxt',
    install: 'npm i @formflowjs/vue',
    body: 'Renderless components and composables exposing reactive state, prop bags, multi-step helpers, and client-safe file/captcha handling — the same engine, idiomatic Vue.',
    file: 'ContactForm.vue',
    lang: 'Vue',
    code: `<script setup lang="ts">
import { FormFlow, FormFlowField } from '@formflowjs/vue';
// schema + baseUrl fetched with createFormFlowClient
</script>

<template>
  <FormFlow :form="schema" :options="{ baseUrl }" v-slot="f">
    <form v-bind="f.formProps">
      <FormFlowField
        v-for="field in f.fields.value"
        :key="field.name"
        :name="field.name"
        v-slot="ff"
      >
        <label v-bind="ff.labelProps.value">{{ field.label }}</label>
        <input v-bind="ff.inputProps.value" />
      </FormFlowField>
      <button :disabled="f.isSubmitting.value">
        {{ schema.settings.submitButtonText }}
      </button>
    </form>
  </FormFlow>
</template>`,
  },
];

const endpoints = [
  { method: 'GET', path: '/api/formflow/forms/:slug', desc: 'Sanitized public schema' },
  { method: 'POST', path: '/api/formflow/forms/:slug/submit', desc: 'Submit field values' },
  { method: 'POST', path: '/api/formflow/forms/:slug/partial', desc: 'Save partial → resume token' },
  { method: 'GET', path: '/api/formflow/forms/:slug/partial/:token', desc: 'Resume a saved draft' },
];

type Price = { price: string; note: string };

const pricing: {
  tier: string;
  badge: Tier;
  blurb: string;
  features: string[];
  cta: string;
  href: string;
  /** Draws the accent border. Exactly one plan should carry it. */
  featured?: boolean;
  // Free is a single flat price; paid tiers are annual recurring.
  flat?: Price;
  annual?: Price;
}[] = [
  {
    tier: 'Free',
    badge: 'free',
    cta: 'Install free',
    href: '#install',
    flat: { price: '$0', note: 'free forever · MIT' },
    blurb: 'A production-ready form builder. Not a trial.',
    features: [
      'Unlimited forms & submissions',
      'Every standard field type, incl. file upload',
      'All validation rules',
      'Submission inbox + CSV / JSON export',
      'Honeypot, rate limit & reCAPTCHA v2',
      'One admin email notification',
      'Public REST API (single-step forms)',
    ],
  },
  {
    tier: 'Pro',
    badge: 'pro',
    cta: 'Buy Pro',
    href: CHECKOUT_URLS.pro,
    featured: true,
    blurb: 'Everything to ship serious forms.',
    annual: { price: '$149', note: '1 project · billed yearly' },
    features: [
      'Everything in Free, plus —',
      'Advanced fields & conditional logic',
      'Multi-step / wizard forms',
      'Autoresponders & branded email',
      'HMAC webhooks + integrations',
      'reCAPTCHA v3, Turnstile, hCaptcha',
      'Analytics, Excel/PDF export, save & resume',
    ],
  },
  {
    tier: 'Business',
    badge: 'business',
    cta: 'Buy Business',
    href: CHECKOUT_URLS.business,
    blurb: 'For compliance-bound teams.',
    annual: { price: '$449', note: '3 projects · billed yearly' },
    features: [
      'Everything in Pro, plus —',
      'GDPR retention & anonymization',
      'Consent fields, per-subject export/delete',
      'Audit log & approval workflows',
      'Multi-language forms',
      'Priority email support',
    ],
  },
  {
    tier: 'Agency',
    badge: 'agency',
    cta: 'Buy Agency',
    href: CHECKOUT_URLS.agency,
    blurb: 'Every client site, one licence.',
    annual: { price: '$999', note: 'unlimited · billed yearly' },
    features: [
      'Everything in Business, plus —',
      'Unlimited project activations',
      'One key across every client build',
      'Add or retire sites without re-buying',
      'Staging & preview deploys included',
    ],
  },
];

type Cell = boolean | string;
const matrix: { capability: string; free: Cell; pro: Cell; business: Cell; agency: Cell }[] = [
  { capability: 'Unlimited forms & submissions', free: true, pro: true, business: true, agency: true },
  { capability: 'Core field types, validation, inbox', free: true, pro: true, business: true, agency: true },
  { capability: 'File upload field', free: true, pro: true, business: true, agency: true },
  { capability: 'CSV / JSON export', free: true, pro: true, business: true, agency: true },
  { capability: 'Spam basics (honeypot, rate limit, v2)', free: true, pro: true, business: true, agency: true },
  { capability: 'One admin email notification', free: true, pro: true, business: true, agency: true },
  { capability: 'Conditional logic, multi-step, advanced fields', free: false, pro: true, business: true, agency: true },
  { capability: 'Advanced email, webhooks, integrations', free: false, pro: true, business: true, agency: true },
  { capability: 'Advanced spam (v3, Turnstile, hCaptcha, blocklist)', free: false, pro: true, business: true, agency: true },
  { capability: 'Analytics, Excel/PDF export, save & resume, white-label', free: false, pro: true, business: true, agency: true },
  { capability: 'GDPR toolkit, audit log, approvals, multi-language', free: false, pro: false, business: true, agency: true },
  { capability: 'Priority email support', free: false, pro: false, business: true, agency: true },
  { capability: 'Projects per licence', free: 'Unlimited', pro: '1', business: '3', agency: 'Unlimited' },
];

/* ------------------------------------------------------------------ *
 * Code samples — kept verbatim-accurate to the published packages.
 * ------------------------------------------------------------------ */

const codeInstall = `npm install @formflowjs/strapi-plugin-formflow`;

const codeEnable = `// config/plugins.ts
export default {
  formflow: {
    enabled: true,
  },
};`;

const codeLicense = `# .env  —  optional, unlocks Pro / Business
FORMFLOW_LICENSE_KEY=your_key_here`;

const codeFetch = `curl https://cms.example.com/api/formflow/forms/contact`;

const codeSubmit = `curl -X POST \\
  https://cms.example.com/api/formflow/forms/contact/submit \\
  -H 'Content-Type: application/json' \\
  -d '{ "name": "Ada Lovelace",
        "email": "ada@example.com",
        "message": "Hello from FormFlow!" }'`;

/* ------------------------------------------------------------------ *
 * Icons — low coordinate precision, no per-instance allocation.
 * ------------------------------------------------------------------ */

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M13.5 4.5 6.5 12 2.5 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M4 10h11m0 0-4-4m4 4-4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <rect x="3" y="7" width="10" height="7" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7V5.2a3 3 0 0 1 6 0V7" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CaretIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

const tierLabel: Record<Tier, string> = {
  free: 'Free',
  pro: 'Pro',
  business: 'Business',
  agency: 'Agency',
};

/* ------------------------------------------------------------------ *
 * Reveal — one IntersectionObserver per wrapper, disconnects on first
 * paint, and is a no-op under prefers-reduced-motion.
 * ------------------------------------------------------------------ */

function Reveal({ children, className, delay }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${shown ? ' is-shown' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <p className="section-label">
      <span className="dot" aria-hidden="true" />
      <span className="idx">{index}</span>
      {children}
    </p>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  return <span className={`tier-badge tier-${tier}`}>{tierLabel[tier]}</span>;
}

function CodeCard({ file, lang, code, className }: { file: string; lang?: string; code: string; className?: string }) {
  return (
    <figure className={`code-card${className ? ` ${className}` : ''}`}>
      <figcaption className="code-head">
        <span className="code-file">{file}</span>
        {lang ? <span className="code-lang">{lang}</span> : null}
      </figcaption>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}

/* The hero specimen: a rendered form tied to the schema that produced
 * it. Decorative, so the whole block is aria-hidden. */
function FormSpecimen() {
  return (
    <div className="specimen" aria-hidden="true">
      <div className="specimen-bar">
        <span className="endpoint">
          <span className="verb">GET</span>
          /api/formflow/forms/contact
        </span>
        <span className="status">200 OK</span>
      </div>

      <div className="specimen-body">
        <div className="ff-field is-valid">
          <span className="ff-label">Full name</span>
          <span className="ff-control">
            Ada Lovelace
            <span className="ff-tick">
              <CheckIcon />
            </span>
          </span>
        </div>

        <div className="ff-field is-focus">
          <span className="ff-label">Email</span>
          <span className="ff-control">
            ada@example.com<span className="ff-caret" />
          </span>
          <span className="ff-help">We only use this to reply.</span>
        </div>

        <div className="ff-field ff-half-row">
          <div className="ff-field ff-half">
            <span className="ff-label">Topic</span>
            <span className="ff-control ff-select">
              Partnership
              <span className="ff-chevron">
                <CaretIcon />
              </span>
            </span>
          </div>
          <div className="ff-field ff-half">
            <span className="ff-label">Budget</span>
            <span className="ff-control ff-select">
              $5k–10k
              <span className="ff-chevron">
                <CaretIcon />
              </span>
            </span>
          </div>
        </div>

        <div className="ff-field">
          <span className="ff-label">Message</span>
          <span className="ff-control ff-area">Loved the headless approach — let's talk.</span>
        </div>

        <button type="button" className="ff-submit" tabIndex={-1}>
          Send message
        </button>
      </div>

      <div className="specimen-schema">
        <span className="schema-cap">// the field above, in the schema</span>
        <span className="schema-line">
          <span className="p">{'{'}</span>
        </span>
        <span className="schema-line ind">
          <span className="k">"name"</span>
          <span className="p">: </span>
          <span className="s">"email"</span>
          <span className="p">,</span>
        </span>
        <span className="schema-line ind">
          <span className="k">"type"</span>
          <span className="p">: </span>
          <span className="s">"email"</span>
          <span className="p">,</span>
        </span>
        <span className="schema-line ind">
          <span className="k">"required"</span>
          <span className="p">: </span>
          <span className="b">true</span>
        </span>
        <span className="schema-line">
          <span className="p">{'}'}</span>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function Component() {
  const [activeSdk, setActiveSdk] = useState(1);
  const sdk = sdks[activeSdk];

  return (
    <>
      <Seo />
      <JsonLd data={[organizationSchema(), websiteSchema()]} />

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">
            Build forms in Strapi.
            <br />
            Render them <em>anywhere</em>.
          </h1>
          <p className="lede">
            FormFlow turns Strapi into a complete form backend — visual building, validated submissions,
            spam protection, email, webhooks, and exports — served over one clean REST API. Every
            submission lands in your own database; your frontend renders it with your own markup.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#install">
              Install free <ArrowIcon />
            </a>
            <a className="btn btn-ghost" href="#sdks">
              Explore the SDKs
            </a>
          </div>
          <ul className="hero-proof">
            <li>
              <CheckIcon /> MIT-licensed core — free forever, not a trial
            </li>
            <li>
              <CheckIcon /> Submissions keep landing, even if a license lapses
            </li>
            <li>
              <CheckIcon /> No CSS shipped — your markup, your design system
            </li>
          </ul>
        </div>

        <div className="hero-art">
          <FormSpecimen />
          <p className="hero-art-note">A live form, rendered straight from its Strapi schema.</p>
        </div>
      </section>

      <section className="compat" aria-label="Compatible with">
        <span className="compat-lead">Plays with</span>
        <ul>
          {compat.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section pipeline split" id="pipeline" aria-labelledby="pipeline-title">
        <div className="section-head pipeline-head">
          <SectionLabel index="01">The lifecycle</SectionLabel>
          <h2 id="pipeline-title">
            Every submission travels the same five stages — and FormFlow owns all of them.
          </h2>
          <p className="section-sub">
            From a schema in Strapi to a delivered, governed submission, one plugin handles the whole
            path. No glue code, no stitched-together services — just the pipeline below.
          </p>
        </div>
        <ol className="flow">
          {pipeline.map((stage, i) => (
            <Reveal key={stage.kicker} delay={i * 60}>
              <li className="flow-step">
                <div className="flow-rail">
                  <span className="flow-num">{`0${i + 1}`}</span>
                  {i < pipeline.length - 1 ? <span className="flow-line" aria-hidden="true" /> : null}
                </div>
                <div className="flow-body">
                  <span className="flow-kicker">{stage.kicker}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.body}</p>
                  <ul className="chip-row">
                    {stage.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="section admin" id="admin" aria-labelledby="admin-title">
        <div className="section-head center">
          <SectionLabel index="02">Inside the admin</SectionLabel>
          <h2 id="admin-title">Everything happens in the Strapi panel.</h2>
          <p className="section-sub">
            Design forms, dial in spam and delivery, and triage submissions — all without leaving your
            CMS. These are real captures from a live FormFlow install.
          </p>
        </div>
        <div className="gallery">
          {gallery.map((g, i) => (
            <Reveal key={g.file} delay={i * 60}>
              <figure className="shot">
                <div className="shot-frame">
                  <span className="shot-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <img src={asset(g.file)} alt={g.alt} loading="lazy" decoding="async" width={1600} height={1000} />
                </div>
                <figcaption>
                  <strong>{g.title}</strong>
                  <span>{g.body}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section fields" id="fields" aria-labelledby="fields-title">
        <div className="section-head center">
          <SectionLabel index="03">Field registry</SectionLabel>
          <h2 id="fields-title">Twenty-plus field types, from text to signature.</h2>
          <p className="section-sub">
            Free covers the inputs every form needs. Advanced fields unlock on any paid plan — the
            builder shows exactly which is which.
          </p>
        </div>
        <div className="field-grid">
          {fieldGroups.map((group) => (
            <Reveal key={group.label}>
              <article className="field-group">
                <h3>{group.label}</h3>
                <ul>
                  {group.fields.map((field) => (
                    <li key={field.name} className={`field-chip chip-${field.tier}`}>
                      <code>{field.name}</code>
                      {field.tier === 'free' ? null : (
                        <span className="chip-lock" aria-label={tierLabel[field.tier]}>
                          <LockIcon />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="field-legend">
          <span className="lg lg-free">Free</span>
          <span className="lg lg-pro">Pro</span>
        </p>
      </section>

      <section className="section sdks" id="sdks" aria-labelledby="sdks-title">
        <div className="section-head">
          <SectionLabel index="04">Frontend SDKs</SectionLabel>
          <h2 id="sdks-title">Headless by design. Your markup stays yours.</h2>
          <p className="section-sub">
            The SDKs fetch the schema, render the fields, validate, and submit — and ship no CSS. Hand
            them a slug; style every element yourself with Tailwind, shadcn, MUI, or plain CSS.
          </p>
        </div>

        <div className="sdk-layout">
          <div className="sdk-cards" role="tablist" aria-label="Choose an SDK to preview its code">
            {sdks.map((item, i) => (
              <Reveal key={item.name}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === activeSdk}
                  className={`sdk-card${i === activeSdk ? ' is-active' : ''}`}
                  onClick={() => setActiveSdk(i)}
                >
                  <span className="sdk-card-head">
                    <span className="sdk-tag">{item.tag}</span>
                    <span className="sdk-pick" aria-hidden="true">
                      {i === activeSdk ? 'Viewing' : 'View code'}
                    </span>
                  </span>
                  <h3>{item.name}</h3>
                  <p>{item.body}</p>
                  <code className="sdk-install">{item.install}</code>
                </button>
              </Reveal>
            ))}
          </div>
          <Reveal className="sdk-code-wrap">
            <CodeCard file={sdk.file} lang={sdk.lang} code={sdk.code} />
            <p className="sdk-code-note">
              Renderless fields hand you value, errors, and ARIA-complete prop getters. Full guides for
              Next.js, Astro, Nuxt, and Vite live in the{' '}
              <a href={SDK_REPO_URL} target="_blank" rel="noreferrer">
                SDK repo
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section quickstart" id="quickstart" aria-labelledby="quickstart-title">
        <div className="section-head">
          <SectionLabel index="05">Quick start</SectionLabel>
          <h2 id="quickstart-title">From npm install to a live endpoint in three steps.</h2>
        </div>
        <div className="qs-grid">
          <Reveal>
            <article className="qs-step">
              <header>
                <span className="qs-num">01</span>
                <h3>Install &amp; enable</h3>
              </header>
              <p>Add the plugin and switch it on. FormFlow creates its own content types on startup.</p>
              <CodeCard file="Terminal" code={codeInstall} />
              <CodeCard file="config/plugins.ts" lang="ts" code={codeEnable} />
            </article>
          </Reveal>
          <Reveal delay={70}>
            <article className="qs-step">
              <header>
                <span className="qs-num">02</span>
                <h3>Build &amp; fetch</h3>
              </header>
              <p>Design a form in the admin, note its slug, then read the sanitized public schema.</p>
              <CodeCard file="Terminal" code={codeFetch} />
              <p className="qs-aside">
                Secrets such as the reCAPTCHA secret key are stripped server-side — the public schema is
                safe to ship to the browser.
              </p>
            </article>
          </Reveal>
          <Reveal delay={140}>
            <article className="qs-step">
              <header>
                <span className="qs-num">03</span>
                <h3>Submit values</h3>
              </header>
              <p>Post a flat map of field names to values. Validation failures return a per-field error map.</p>
              <CodeCard file="Terminal" code={codeSubmit} />
            </article>
          </Reveal>
        </div>

        <Reveal className="api-table-wrap">
          <div className="api-table" role="region" aria-label="Public content API endpoints" tabIndex={0}>
            <div className="api-row api-head">
              <span>Method</span>
              <span>Path</span>
              <span>What it does</span>
            </div>
            {endpoints.map((ep) => (
              <div className="api-row" key={ep.path}>
                <span className={`api-verb verb-${ep.method.toLowerCase()}`}>{ep.method}</span>
                <span className="api-path">{ep.path}</span>
                <span className="api-desc">{ep.desc}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
        <div className="section-head center">
          <SectionLabel index="06">Pricing</SectionLabel>
          <h2 id="pricing-title">Start free. Upgrade when your workflows grow.</h2>
          <p className="section-sub">
            The free core is genuinely production-ready — not a trial. Paid plans are gated at
            runtime by a license key; remove it and FormFlow keeps capturing submissions as the free
            tier. Pro and Business cover one and three projects; Agency covers as many as you run.
          </p>
        </div>
        <div className="price-grid">
          {pricing.map((plan) => {
            const p = plan.annual ?? plan.flat!;
            return (
              <article
                key={plan.tier}
                className={plan.featured ? 'price-card is-featured' : 'price-card'}
              >
                <div className="price-top">
                  <div className="price-tier">
                    <h3>{plan.tier}</h3>
                    <TierBadge tier={plan.badge} />
                  </div>
                  <p className="price-blurb">{plan.blurb}</p>
                </div>
                <div className="price-amount">
                  <strong>{p.price}</strong>
                  <span>{p.note}</span>
                </div>
                <ul className="price-features">
                  {plan.features.map((feat) => (
                    <li key={feat}>
                      <span className="feat-tick">
                        <CheckIcon />
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <a className="btn btn-primary price-cta" href={plan.href}>
                  {plan.cta}
                </a>
              </article>
            );
          })}
        </div>

        <div className="license-faq">
          <h3>How licensing works</h3>
          <dl>
            <div>
              <dt>What counts as a &ldquo;project&rdquo;?</dt>
              <dd>
                One activation covers one FormFlow installation. Pro includes one, Business three,
                and Agency as many as you need. Restarts, redeploys, and plugin updates reuse the
                same activation — they never consume another one.
              </dd>
            </div>
            <div>
              <dt>My premium features stopped working. Why?</dt>
              <dd>
                Almost always an activation still held by an installation you no longer use. Resetting
                your database, changing your license key, or moving to a new server registers a fresh
                installation while the old one keeps its slot. Deactivate the old site from your
                account dashboard and restart Strapi.
              </dd>
            </div>
            <div>
              <dt>What if my server can&rsquo;t reach the license service?</dt>
              <dd>
                Premium features keep working for 14 days from the last successful check, so an
                outage on our side never interrupts you.
              </dd>
            </div>
            <div>
              <dt>What happens when a license expires?</dt>
              <dd>
                Premium features switch off, but <strong>your forms, submissions, and data are never
                touched</strong> — FormFlow keeps capturing submissions as the free tier.
              </dd>
            </div>
            <div>
              <dt>I rebuild environments often (CI, preview deploys).</dt>
              <dd>
                Each rebuilt environment registers as a new installation. Contact us and we&rsquo;ll
                raise your activation quota.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section matrix" aria-labelledby="matrix-title">
        <div className="section-head center">
          <SectionLabel index="07">The open-core line</SectionLabel>
          <h2 id="matrix-title">A clear boundary between free and premium.</h2>
        </div>
        <Reveal className="matrix-wrap">
          <div className="matrix-scroll" role="region" aria-label="Feature availability by plan" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>Free</th>
                  <th>Pro</th>
                  <th>Business</th>
                  <th>Agency</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.capability}>
                    <td>{row.capability}</td>
                    {[row.free, row.pro, row.business, row.agency].map((cell, i) => (
                      <td key={i}>
                        {typeof cell === 'string' ? (
                          <span className="count">{cell}</span>
                        ) : cell ? (
                          <span className="yes">
                            <CheckIcon />
                          </span>
                        ) : (
                          <span className="no" aria-label="Not included">
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      <section className="install" id="install" aria-labelledby="install-title">
        <div className="install-inner">
          <div className="install-copy">
            <SectionLabel index="08">Ship it</SectionLabel>
            <h2 id="install-title">Add FormFlow to Strapi, then wire any frontend.</h2>
            <p>
              Requires Strapi v5. The plugin creates its own content types automatically — no migration.
              A paid license key is read server-side from one env var and degrades safely to Free
              with zero data loss.
            </p>
            <div className="install-actions">
              <a className="btn btn-primary" href={NPM_URL} target="_blank" rel="noreferrer">
                View on npm <ArrowIcon />
              </a>
              <a className="btn btn-ondark" href={REPO_URL} target="_blank" rel="noreferrer">
                Read the docs
              </a>
            </div>
          </div>
          <div className="install-code">
            <CodeCard file="Terminal" code={codeInstall} className="on-dark" />
            <CodeCard file="config/plugins.ts" lang="ts" code={codeEnable} className="on-dark" />
            <CodeCard file=".env" code={codeLicense} className="on-dark" />
          </div>
        </div>
      </section>
    </>
  );
}
