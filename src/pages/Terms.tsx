import Seo from '../components/seo/Seo';
import Breadcrumbs from '../components/blog/Breadcrumbs';
import TableOfContents from '../components/blog/TableOfContents';
import { Callout } from '../components/blog/MDXComponents';
import { REPO_URL } from '../config/site';
import { formatDate } from '../lib/format';

/** Effective / last-updated date for this revision of the Terms. */
const LAST_UPDATED = '2026-07-29';

const SUPPORT_EMAIL = 'hadi@digid.ca';

export function Component() {
  return (
    <article className="post legal">
      <Seo
        title="Terms & Conditions"
        description="The terms that govern your use of the FormFlow Strapi plugin, its free MIT-licensed core, its premium Enterprise Edition features, and paid Pro and Business plans."
      />

      <div className="post-head">
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Terms & Conditions', path: '/terms' },
          ]}
        />
        <h1 className="post-title">Terms &amp; Conditions</h1>
        <p className="post-desc">
          These Terms govern your use of FormFlow — the free core, the premium Enterprise Edition
          features, and the paid Pro and Business plans. Please read them before you buy or deploy.
        </p>
        <p className="post-meta">
          <span>Last updated</span>
          <span className="dot-sep" aria-hidden="true" />
          <time dateTime={LAST_UPDATED}>{formatDate(LAST_UPDATED)}</time>
        </p>
      </div>

      <div className="post-layout">
        <div className="post-body" id="terms-body">
          <div className="prose">
            <Callout type="note">
              <p>
                <strong>In short:</strong> the FormFlow core is free and MIT-licensed forever. Paid
                plans unlock premium features and renew once a year. Refunds are available for 14
                days, no questions asked. Your forms and submissions live on your own servers, stay
                yours, and keep working even if a licence lapses.
              </p>
            </Callout>

            <h2 id="agreement">1. Agreement and acceptance</h2>
            <p>
              These Terms &amp; Conditions (the <strong>&ldquo;Terms&rdquo;</strong>) form a binding
              agreement between you (<strong>&ldquo;you&rdquo;</strong>, the individual or
              organisation using FormFlow) and <strong>Digid Inc.</strong> (
              <strong>&ldquo;we&rdquo;</strong>, <strong>&ldquo;us&rdquo;</strong>,{' '}
              <strong>&ldquo;our&rdquo;</strong>), a company incorporated in Canada.
            </p>
            <p>
              You accept these Terms when you install, copy, or use FormFlow, or when you buy a
              subscription. If you do not agree with them, do not use FormFlow. If you are agreeing
              on behalf of an organisation, you confirm you have the authority to bind that
              organisation, and &ldquo;you&rdquo; means that organisation.
            </p>
            <p>You must be able to form a binding contract in your jurisdiction to use FormFlow.</p>

            <h2 id="definitions">2. Definitions</h2>
            <dl>
              <dt>FormFlow / the Software</dt>
              <dd>
                The FormFlow plugin for Strapi v5, its documentation, the companion client SDKs, and
                this website.
              </dd>

              <dt>Free Core</dt>
              <dd>
                The parts of FormFlow distributed under the MIT licence. The Free Core is a complete,
                production-ready product — not a trial or a time-limited demo.
              </dd>

              <dt>Premium Features / Enterprise Edition (EE)</dt>
              <dd>
                The parts of FormFlow that live under <code>ee/</code> directories in the source and
                are distributed under the FormFlow EE License. Using them in production requires a
                valid Licence Key.
              </dd>

              <dt>Licence Key</dt>
              <dd>
                The key issued to you when you buy a paid plan, which you set as the{' '}
                <code>FORMFLOW_LICENSE_KEY</code> environment variable in your own Strapi
                installation.
              </dd>

              <dt>Activation</dt>
              <dd>
                One registered installation of FormFlow running against your Licence Key. Each plan
                permits a fixed number of concurrent Activations.
              </dd>

              <dt>Freemius</dt>
              <dd>
                Freemius, Inc., our Merchant of Record. Freemius sells FormFlow subscriptions to you
                on our behalf and handles checkout, payment, taxes, invoices, and refunds.
              </dd>

              <dt>Customer Data</dt>
              <dd>
                Everything you create, collect, or store with FormFlow on your own infrastructure —
                form definitions, form submissions, uploaded files, and configuration.
              </dd>
            </dl>

            <h2 id="licence-grant">3. Licence grant</h2>
            <p>
              FormFlow is <strong>open-core</strong>. Two different licences apply to two different
              parts of the same codebase, and it matters which one you are relying on.
            </p>

            <h3 id="licence-free-core">3.1 The Free Core (MIT)</h3>
            <p>
              The Free Core is licensed to everyone under the{' '}
              <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
                MIT licence
              </a>
              . That licence — not these Terms — governs what you may do with that code. You may use
              it commercially, modify it, and redistribute it, subject to the MIT licence&rsquo;s
              own conditions. There is no limit on the number of forms or submissions in the Free
              Core, and no obligation to ever pay us anything.
            </p>
            <p>
              Nothing in these Terms restricts the rights the MIT licence gives you in the Free Core.
              Where these Terms and the MIT licence conflict in respect of the Free Core, the MIT
              licence wins.
            </p>

            <h3 id="licence-premium">3.2 Premium features (FormFlow EE License)</h3>
            <p>
              Premium Features are <strong>source-available</strong>: the code is published so you
              can read it, audit it, and evaluate it. It is <em>not</em> open source, and publishing
              it does not grant you a licence to run it in production.
            </p>
            <p>
              If you hold an active paid subscription, we grant you a non-exclusive,
              non-transferable, non-sublicensable, worldwide licence, for the term of that
              subscription, to install and use the Premium Features in production, on the number of
              Activations your plan permits, for your own purposes or those of your clients.
            </p>
            <p>
              You may modify the Premium Feature source for your own internal use. You may not
              redistribute it, modified or not. This licence ends when your subscription ends.
            </p>

            <h2 id="permitted-prohibited">4. Permitted and prohibited use</h2>
            <p>You may:</p>
            <ul>
              <li>Run FormFlow on any infrastructure you control, including for client work.</li>
              <li>Read and evaluate the full source, including the Premium Feature source.</li>
              <li>
                Modify FormFlow for your own use (note that modifying it may affect our ability to
                support it).
              </li>
            </ul>
            <p>You may not:</p>
            <ul>
              <li>
                Redistribute, republish, resell, sublicense, or make available to third parties the
                Premium Feature source or compiled Premium Features, whether modified or not.
              </li>
              <li>
                Remove, disable, bypass, patch, or otherwise circumvent the licence checks, the
                Activation limits, or any part of the licensing mechanism.
              </li>
              <li>
                Share, publish, sell, or otherwise disclose your Licence Key, or use a Licence Key
                you are not entitled to. Treat your key as a credential.
              </li>
              <li>
                Use FormFlow to break the law, to infringe anyone&rsquo;s rights, to send spam, or to
                collect data you have no lawful basis to collect.
              </li>
              <li>
                Use our name, logo, or branding in a way that suggests we endorse or are affiliated
                with your product without our written permission.
              </li>
            </ul>

            <h2 id="plans-billing">5. Plans, billing, renewal and cancellation</h2>
            <p>
              We offer a free tier and two paid plans: <strong>Pro at US$79 per year</strong> and{' '}
              <strong>Business at US$299 per year</strong>. Both are priced <strong>per project</strong>{' '}
              and sold as <strong>annual subscriptions only</strong>. We do not offer a lifetime
              plan.
            </p>
            <p>
              <strong>Freemius is the Merchant of Record</strong> for every FormFlow purchase. That
              means Freemius — not Digid Inc. — is the seller of record. Freemius operates the
              checkout, processes your payment, calculates and remits applicable taxes (including EU
              VAT, UK VAT, US sales tax, and Canadian GST/HST where they apply), and issues your
              invoice. Digid Inc. does not process, handle, or store your payment card details.
              Freemius&rsquo;s own terms and privacy policy apply to the transaction alongside these
              Terms.
            </p>
            <p>
              <strong>Auto-renewal.</strong> Subscriptions renew automatically every year at the
              then-current price for your plan, using your saved payment method, until you cancel.
              You authorise that recurring charge when you buy. We will give you reasonable notice
              before any price change affecting your renewal, and you may cancel rather than accept
              it.
            </p>
            <p>
              <strong>Cancelling.</strong> You can cancel at any time from your Freemius customer
              dashboard, or by emailing us at{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Cancelling stops the next
              renewal; your Premium Features remain active until the end of the period you have
              already paid for. Cancelling on its own is not a refund request — see section 6.
            </p>
            <p>
              <strong>Failed payments.</strong> If a renewal payment fails and is not resolved,
              Premium Features switch off at the next licence check. Your Customer Data is not
              affected.
            </p>

            <h2 id="refunds">6. 14-day money-back guarantee</h2>
            <p>
              If FormFlow is not right for you, ask for a refund within{' '}
              <strong>14 days</strong> of your purchase and we will refund it in full. No
              justification required, though we would genuinely like to hear what went wrong.
            </p>
            <p>
              Request a refund through your Freemius customer dashboard, or email{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and we will arrange it.
              Refunds are issued by Freemius as Merchant of Record, back to the original payment
              method; how quickly it lands depends on your bank or card issuer.
            </p>
            <p>
              The guarantee covers your first purchase of a plan. Renewal payments are not
              automatically refundable, but if a renewal caught you by surprise, contact us — we
              will deal with it reasonably. When a purchase is refunded, the corresponding Licence
              Key is deactivated and your right to use the Premium Features ends.
            </p>

            <h2 id="activations">7. Activation limits</h2>
            <p>
              Each paid plan permits a fixed number of concurrent Activations, stated on the pricing
              page for that plan. One Activation covers one FormFlow installation. Restarting
              Strapi, redeploying, and updating the plugin all reuse the existing Activation and
              never consume another one.
            </p>
            <p>
              Some events do register as a <em>new</em> installation while the old one keeps its
              slot: resetting or replacing your database, changing your Licence Key, or moving to a
              new server. That is expected behaviour, not a fault. You can free the stale slot by
              deactivating the old installation from your account dashboard.
            </p>
            <p>
              If you legitimately need more Activations — for example because you rebuild
              environments frequently in CI or use preview deploys — contact us and we will raise
              your quota. What you may not do is work around the limit by tampering with the
              licensing mechanism or by sharing keys.
            </p>

            <h2 id="availability">8. Availability of premium features</h2>
            <p>
              FormFlow periodically checks your Licence Key against our licence service. Two things
              follow from that:
            </p>
            <ul>
              <li>
                <strong>If the licence service is unreachable</strong>, Premium Features keep working
                for a <strong>14-day grace period</strong> measured from the last successful check.
                An outage on our side does not interrupt you.
              </li>
              <li>
                <strong>If your licence is revoked, cancelled, expired, or refunded</strong>, Premium
                Features are removed at the next check — within 24 hours, or immediately if you
                trigger a manual refresh.
              </li>
            </ul>
            <p>
              We do not guarantee uninterrupted availability of the licence service, and we are not
              liable for downstream effects of an outage beyond restoring the service and, where an
              extended outage was our fault, extending your subscription by a fair equivalent
              period.
            </p>

            <h2 id="support">9. Support</h2>
            <p>
              Support is provided on a <strong>best-effort basis</strong>. We do not offer a service
              level agreement, guaranteed response time, or guaranteed resolution, and none should
              be inferred from these Terms or from any marketing material.
            </p>
            <p>
              Two channels are available: public issues in the{' '}
              <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
                GitHub repository
              </a>{' '}
              (best for bugs and feature requests, and open to free-tier users too), and email to{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> for licensing, billing, and
              account matters. Paid customers get priority, in the ordinary sense of the word rather
              than as a contractual commitment.
            </p>
            <p>
              Support covers unmodified FormFlow running on a supported version of Strapi. We are
              not obliged to support modified builds, unsupported Strapi versions, or problems
              originating in your own infrastructure or third-party code.
            </p>

            <h2 id="telemetry">10. Telemetry and the data we collect</h2>
            <p>
              FormFlow sends anonymous usage telemetry so we can see which versions are in use and
              where to spend our effort. It is <strong>opt-out</strong>, and it is deliberately
              narrow.
            </p>
            <p>What telemetry sends:</p>
            <ul>
              <li>
                A hashed install identifier — a SHA-256 hash of your Strapi project UUID. It is not
                reversible and does not identify you or your server.
              </li>
              <li>Plugin, Strapi, and Node.js version numbers.</li>
              <li>Your licence tier (free, Pro, or Business).</li>
              <li>A count of how many forms exist.</li>
              <li>
                An approximate country, derived at the network edge. We do not receive, log, or store
                your IP address.
              </li>
            </ul>
            <p>
              What telemetry <strong>never</strong> sends: form content, form submissions, personal
              data collected through your forms, field names or values, environment variables, API
              keys, licence keys, email addresses, or any other secret.
            </p>
            <p>To turn it off, either:</p>
            <ul>
              <li>
                set <code>FORMFLOW_TELEMETRY_DISABLED=true</code> in your environment; or
              </li>
              <li>
                disable Strapi&rsquo;s own telemetry (<code>STRAPI_TELEMETRY_DISABLED</code>) —
                FormFlow telemetry then switches off automatically, without any extra step.
              </li>
            </ul>
            <p>
              Separately from telemetry, when you buy a plan Freemius collects the billing details
              needed to sell you a licence and issue an invoice, and shares with us the information
              we need to administer your licence and support you (such as your email address, plan,
              and licence status). Freemius handles that data as Merchant of Record under its own
              terms and privacy policy.
            </p>

            <h2 id="customer-data">11. Your data stays yours</h2>
            <p>
              FormFlow runs entirely on <strong>your own infrastructure</strong>. Digid Inc. does not
              host your forms, does not receive your form submissions, and has no access to your
              Strapi instance or its database.
            </p>
            <p>
              All Customer Data is and remains yours. We claim no ownership or licence over it.
              Because your forms and submissions live in your own database, they are entirely
              unaffected by anything to do with licensing: if your subscription expires, is
              cancelled, or is refunded, FormFlow continues to capture and store submissions as the
              free tier. Nothing is deleted, locked, held hostage, or degraded.
            </p>
            <p>
              You are the controller of any personal data your forms collect from your own users, and
              you are responsible for complying with the privacy and data-protection laws that apply
              to you — including notice, lawful basis, retention, and responding to data-subject
              requests. FormFlow provides tools (such as IP anonymisation and data-retention
              settings) to help, but the obligations are yours.
            </p>
            <p>
              You are also responsible for your own backups. FormFlow is not a backup service.
            </p>

            <h2 id="ip">12. Intellectual property</h2>
            <p>
              Except for the rights expressly granted in section 3, Digid Inc. and its licensors
              retain all right, title, and interest in FormFlow, including all copyright, trade
              secrets, and other intellectual property in it, and in the FormFlow name, logo, and
              branding. These Terms grant you a licence, not a sale.
            </p>
            <p>
              FormFlow includes third-party open-source components, each governed by its own licence.
              Those licences continue to apply to those components.
            </p>
            <p>
              If you send us feedback, bug reports, or suggestions, you grant us a perpetual,
              irrevocable, royalty-free licence to use them to improve FormFlow, with no obligation
              to you. Code contributions to the public repository are governed by the repository&rsquo;s
              contribution terms.
            </p>

            <h2 id="warranties">13. Disclaimer of warranties</h2>
            <p>
              FormFlow is provided <strong>&ldquo;as is&rdquo;</strong> and{' '}
              <strong>&ldquo;as available&rdquo;</strong>, without warranty of any kind. To the
              fullest extent permitted by law, we disclaim all warranties, express, implied, or
              statutory, including any implied warranties of merchantability, fitness for a
              particular purpose, title, non-infringement, and any warranty arising from a course of
              dealing or usage of trade.
            </p>
            <p>
              We do not warrant that FormFlow will be uninterrupted, error-free, or secure; that it
              will meet your requirements; that defects will be corrected; or that it is compatible
              with every version of Strapi, every hosting environment, or every third-party
              integration. You are responsible for evaluating whether FormFlow is suitable for your
              use case and for testing it before you rely on it.
            </p>
            <p>
              Some jurisdictions do not allow the exclusion of certain warranties. Where that is the
              case, the exclusions above apply only to the extent permitted, and any statutory
              rights you have as a consumer are unaffected.
            </p>

            <h2 id="liability">14. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, neither party is liable for indirect,
              incidental, special, consequential, exemplary, or punitive damages, or for lost
              profits, lost revenue, lost or corrupted data, loss of goodwill, or business
              interruption, arising out of or relating to FormFlow or these Terms — even if advised
              that such damages were possible.
            </p>
            <p>
              To the fullest extent permitted by law, our total aggregate liability for all claims
              arising out of or relating to FormFlow or these Terms is limited to{' '}
              <strong>the amount you actually paid us for FormFlow in the twelve (12) months
              immediately preceding the event giving rise to the claim</strong>. If you have paid us
              nothing — for example because you use only the Free Core — our total aggregate
              liability is limited to CAD $100.
            </p>
            <p>
              These limits apply regardless of the legal theory (contract, tort, negligence, strict
              liability, statute, or otherwise) and survive any failure of an essential purpose of a
              limited remedy. They do not limit liability for fraud, fraudulent misrepresentation,
              death or personal injury caused by negligence, or any other liability that cannot
              lawfully be limited.
            </p>

            <h2 id="indemnity">15. Indemnity</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Digid Inc. and its directors,
              officers, employees, and contractors from and against any third-party claim, demand,
              proceeding, loss, liability, damage, cost, or expense (including reasonable legal fees)
              arising out of or relating to:
            </p>
            <ul>
              <li>your use of FormFlow, including any Customer Data you collect or process with it;</li>
              <li>your breach of these Terms or of any applicable law; or</li>
              <li>
                your infringement of a third party&rsquo;s intellectual property, privacy, or other
                rights.
              </li>
            </ul>
            <p>
              We will notify you promptly of any such claim and give you reasonable cooperation. You
              may not settle a claim in a way that imposes an obligation or admission on us without
              our written consent.
            </p>

            <h2 id="termination">16. Suspension and termination</h2>
            <p>
              You may stop using FormFlow, and cancel any subscription, at any time (section 5).
            </p>
            <p>
              We may suspend or terminate your Licence Key and your right to use the Premium
              Features if you materially breach these Terms — in particular by circumventing the
              licensing mechanism, sharing your Licence Key, or redistributing the Premium Feature
              source. Where the breach is capable of being cured and was not deliberate, we will
              give you notice and a reasonable opportunity to fix it first.
            </p>
            <p>
              We may also terminate a subscription for convenience by refunding the unused portion of
              the current term on a pro-rated basis.
            </p>
            <p>
              On termination, your licence to the Premium Features ends and they stop working at the
              next licence check. Your rights in the Free Core under the MIT licence are unaffected,
              FormFlow continues to run as the free tier, and your Customer Data is untouched.
              Sections 10 to 15 and 17 survive termination.
            </p>

            <h2 id="changes">17. Changes to these Terms</h2>
            <p>
              We may update these Terms as the product and the business change. When we do, we will
              update the &ldquo;Last updated&rdquo; date at the top of this page.
            </p>
            <p>
              For material changes that adversely affect paying customers, we will give reasonable
              advance notice — normally by email to the address associated with your subscription —
              before the change takes effect for you. If you do not accept a material change, your
              remedy is to cancel before your next renewal. Continuing to use FormFlow after a change
              takes effect means you accept the updated Terms.
            </p>
            <p>
              Changes are not retroactive: the version of these Terms in force at the time of your
              purchase governs that purchase.
            </p>

            <h2 id="governing-law">18. Governing law and venue</h2>
            <p>
              These Terms are governed by the laws of the{' '}
              <strong>Province of Ontario and the federal laws of Canada applicable therein</strong>,
              without regard to conflict-of-laws rules. The United Nations Convention on Contracts
              for the International Sale of Goods does not apply.
            </p>
            <p>
              You and Digid Inc. submit to the exclusive jurisdiction of the courts located in the
              Province of Ontario, Canada, for any dispute arising out of or relating to these Terms.
              If you are a consumer, this does not deprive you of the protection of the mandatory law
              of your place of residence, or of the right to bring proceedings there where that law
              gives you that right.
            </p>

            <h2 id="general">19. General</h2>
            <p>
              These Terms, together with the MIT licence (for the Free Core), the FormFlow EE License
              (for the Premium Features), and Freemius&rsquo;s terms (for the transaction), are the
              entire agreement between us about FormFlow, and replace any earlier understanding on
              the subject.
            </p>
            <p>
              If any provision is found unenforceable, it is modified to the minimum extent needed to
              make it enforceable, or severed, and the rest stays in force. A failure to enforce a
              provision is not a waiver of it. You may not assign these Terms without our written
              consent; we may assign them in connection with a merger, acquisition, or sale of
              assets. Nothing here creates a partnership, agency, or employment relationship. Neither
              party is liable for a failure to perform caused by events beyond its reasonable
              control.
            </p>

            <h2 id="contact">20. Contact</h2>
            <p>
              Questions about these Terms, your licence, or your subscription go to a real person:
            </p>
            <ul>
              <li>
                Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
              </li>
              <li>
                Bugs and feature requests:{' '}
                <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
                  GitHub issues
                </a>
              </li>
              <li>Company: Digid Inc., Ontario, Canada</li>
            </ul>
          </div>
        </div>

        <aside className="post-aside">
          <TableOfContents containerId="terms-body" />
        </aside>
      </div>
    </article>
  );
}
