# Putting the app on a real domain

Written 30 October 2026. The point of this is not the nicer URL — it is that a Clerk
**production** instance needs a domain you control, and until it has one, sign-in runs on a
development instance that bounces every cold load through `accounts.dev` to mint a
development-browser token — the pattern iOS Safari's bounce-tracking protection targets.
See item 13 in [BACKLOG.md](../BACKLOG.md) for why that matters.

**No application code changes.** Clerk reads its keys from the environment, the middleware
protects nothing, and the sign-in pages use relative paths. Nothing in `app/`, `lib/` or
`middleware.ts` has the current URL baked into it — this is all registrar, DNS and environment.

## Do you actually need this?

Probably not, and it is worth being honest about that before spending a weekend on DNS.

Nothing your friends do needs it. They never sign in — the app is fully usable signed out, that is
the default, and a shared URL gives them a blank slate. Sign-in exists only so your own progress
follows you between your own devices, so the entire question reduces to: does sign-in survive on
your phone? **Test that first.** Sign in on the iPhone, use it, come back a week later. If you are
still signed in, a domain buys you nothing you need.

There is also a cost nobody mentions. Once a Clerk production instance depends on the domain,
letting the domain lapse breaks sign-in. A free-for-one-year student domain is exactly the kind of
thing that quietly expires, whereas `wuwa-companion-phi.vercel.app` never will. Set a renewal
reminder on day one or do not start.

If the phone test does fail, a domain is not the only fix — see the next section, which is the
result of actually trying the alternative.

**Decided on 31 October 2026: do it anyway, before the phone test.** The reasoning is in the next
section rather than here — the proxy alternative works but holds together only on undocumented
props, so the domain is not just the fix for the iOS risk, it is the only supported code path.
Year one is free and the renewal is ~$12–15, which is a small price for not depending on
`__internal_`-prefixed API. The phone test is still worth running, but as a measurement of whether
the problem was real, not as a gate on starting.

## The Frontend API proxy: tried, works, not shipped

Tried 30 October 2026 on `@clerk/nextjs` 7.9.22. It works. It is still not the recommended route,
and the reason is worth writing down rather than re-deriving later.

**The idea.** `clerkMiddleware` takes a `frontendApiProxy` option that serves Clerk's Frontend API
from the app's own origin at `/__clerk`. Same-origin means no cross-site hop, which is the entire
defect a domain would fix. Clerk clearly built this for exactly this situation — its auto-enable
list in `@clerk/shared/proxy` is literally `['.vercel.app']` — but auto-enable also requires a
production publishable key, and ours is `pk_test_`, so it has to be switched on by hand.

**Two lines get you most of the way.**

```ts
// middleware.ts
export default clerkMiddleware({ frontendApiProxy: { enabled: true } });
```

```tsx
// app/layout.tsx — relative, so one value covers localhost, previews and production
<ClerkProvider proxyUrl="/__clerk">
```

That half genuinely works. Measured on a cookieless request, the handshake target changes from
`https://tender-narwhal-52.clerk.accounts.dev/v1/client/handshake?…` to a bare
`/__clerk/v1/client/handshake?…`. Following the chain: three redirects, back to the original URL
at 200, `__clerk_db_jwt` and `__client_uat` set by our own host, and a second load with those
cookies returning 200 with no handshake at all.

**And then Clerk JS will not load.** Setting `proxyUrl` also makes Clerk resolve its own script
bundles against the proxy, so the browser asks our origin for
`/__clerk/npm/@clerk/clerk-js@6/dist/clerk.browser.js` and gets a 404 — the proxy forwards API
paths, not `/npm/…`. Result: `window.Clerk === undefined` and "Failed to load Clerk JS". This
shipped to production for a few minutes and sign-in was dead; the app itself kept working, because
it is local-first and signed-out is the default path, but only by luck.

**It can be completed, with two more values.** Pinning both bundles makes it fully work —
`window.Clerk` loads, no console errors, and every API call goes to `/__clerk/v1/*` at 200:

```
NEXT_PUBLIC_CLERK_JS_URL=https://<instance>.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js
NEXT_PUBLIC_CLERK_UI_URL=https://<instance>.clerk.accounts.dev/npm/@clerk/ui@1/dist/ui.browser.js
```

**Why it is not shipped anyway.** Those two map to `__internal_clerkJSUrl` and
`__internal_clerkUIUrl`, and the `__internal_` prefix is Clerk telling you not to depend on them.
They also hardcode the instance hostname and a major version by hand, so they go stale when keys
rotate or the instance changes. The failure mode is the problem: if Clerk changes how either bundle
resolves, sign-in breaks **silently** — nobody notices until they try to sign in. Being signed out
after a week on an iPhone is a smaller fault than that.

So: the proxy is the right mechanism and Clerk agrees, but on a development instance it needs
undocumented props to hold together. On a production instance with a CNAME, none of this is
necessary, because the bundles come from `clerk.<domain>` on their own. That is the argument for the
domain, and it is a better one than the iOS risk alone.

## Which domain

The GitHub Student Developer Pack has three domain offers, all free for the first year, all
requiring verified student status:

| Offer | TLDs | Keep-it cost after year one |
| --- | --- | --- |
| **Name.com** | 25+, including `.dev`, `.app`, `.live`, `.studio`, `.software` | `.dev` and `.app` are the cheapest of the lot, roughly $12–15/year |
| Namecheap | `.me` only | mid-range, roughly $16–31/year depending on registrar |
| get.tech | `.tech` only | the worst, roughly $50–70/year |

**Take the Name.com offer and pick a `.dev` or `.app`.** Year one is free in every case, so the
only number that matters is the renewal, and those two are the cheapest to hold long-term. Both
are on the HSTS preload list, meaning browsers refuse plain HTTP on them — which costs nothing
here, because Vercel and Clerk both serve HTTPS anyway.

One Name.com quirk from their own offer text: make sure the account has a unique address, or the
system may read the request as a duplicate.

### Names, checked free on 31 October 2026

Checked by RDAP (`https://rdap.org/domain/<name>`, where 404 means unregistered and 200 means
taken — verified against `google.dev`, `web.dev` and `clerk.app`, all 200). All seven were free:

```
resonancecodex.app     resonancecodex.dev     resonance-codex.dev
rescodex.app           rescodex.dev
wuwacodex.app          wuwacodex.dev
```

**`resonancecodex.app` is the pick.** It matches the app's own name, and it deliberately avoids
"wuwa" — "Wuthering Waves" is Kuro Games' trademark, and the abbreviation is close enough to it
that a complaint is conceivable. Normally that would not matter much, but here sign-in depends on
the domain resolving, so a domain that could be disputed is a domain that could take auth down
with it. The repository name can stay `wuwa-companion`; nothing requires the two to match.

Availability can change between the check and the claim. If the name has gone, re-run the RDAP
check on the next candidate rather than guessing.

## The sequence

Steps marked **you** need an account only you can sign into. The rest can run from here.

Prerequisites confirmed on this machine, 31 October 2026: Node 24.22.1, Vercel CLI 65.7.0, logged
in as `ham1115`, and `.vercel/project.json` present — so steps 2 and 4 are ready to run the moment
the domain exists. Step 5 still needs your `clerk login` first.

### 0. Set the renewal reminder — you

Do this *before* claiming, while the consequence is fresh: a calendar entry for roughly eleven
months out, titled so that future-you understands the stakes — "renew the domain or app sign-in
breaks". The domain is free for a year, which is exactly what makes it easy to lose. This step
costs thirty seconds and is the only one that protects everything below it.

### 1. Claim the domain — you

[education.github.com/pack](https://education.github.com/pack) → the Name.com offer → claim
`resonancecodex.app` (see **Which domain** above for why that name, and for the fallbacks).
Nothing below works until this exists.

### 2. Create the DNS zone on Vercel

```
vercel domains add <domain>
```

With no project argument this adds the apex domain to the `hambyte` team and creates its DNS zone,
printing the nameservers to use. Hosting DNS at Vercel rather than at Name.com is deliberate: it
puts the app's records and Clerk's five records in one place, and makes both scriptable.

### 3. Point the registrar at Vercel — you

At Name.com, replace the default nameservers with the pair the previous step printed (normally
`ns1.vercel-dns.com` and `ns2.vercel-dns.com`). Propagation is usually minutes, but allow up to 48
hours before treating a failure as real.

### 4. Assign the domain to the project

```
vercel domains add <domain> wuwa-companion
```

Vercel creates the apex and `www` records itself and issues the certificate. At this point the app
answers on the new name, still on development Clerk keys.

### 5. Link the Clerk app — you, then here

The Clerk application was created by the Vercel Marketplace (resource `clerk-crimson-saddle`), not
by the Clerk CLI, which is why `clerk deploy status` reports `not_linked` and `clerk whoami` shows
no email. Fixing that needs a login only you can do:

```
npx clerk@latest login
```

Then linking can run from here — `npx clerk@latest link` picks the app.

Do **not** run `clerk init`. On a project that already has Clerk keys it can provision a second
Clerk application and overwrite the Marketplace-managed ones.

### 6. Create the production instance

```
npx clerk@latest deploy --domain <domain>
```

This creates the production instance from the development configuration, prints the CNAME records,
and prompts for production OAuth credentials. It is resumable — re-running it picks up where it
stopped. Run interactively if you want the OAuth prompts; in agent mode it creates the instance and
returns JSON with a `nextAction` field instead.

### 7. Load Clerk's DNS records

`clerk deploy` can export the records as a DNS zone file, which pairs exactly with:

```
vercel dns import <domain> <zonefile>
```

Five records, give or take: a CNAME on `clerk` for the Frontend API, one on `accounts` for the
Account Portal, and three for mail and DKIM whose targets carry an instance-specific hash. Take the
exact values from the zone file or the Dashboard's Domains page rather than from this document.

The Frontend API CNAME is the one that makes this whole exercise worthwhile: it puts Clerk on
`clerk.<domain>`, same-site with the app, so the handshake redirect goes away, the session moves to
a normal `HttpOnly` cookie, and nothing is left for iOS to purge on a seven-day timer.

### 8. Deploy certificates and verify

```
npx clerk@latest deploy status --wait
```

Keeps checking until DNS, SSL and email DNS verify. If certificate issuance stalls for more than a
few minutes, check for CAA records blocking the issuer:

```
dig <domain> +short CAA
```

Any output means a CAA record may need removing. A freshly registered domain should have none.

### 9. Swap the keys and redeploy

The existing `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in Vercel are type
`Config` — managed by the Marketplace integration rather than plain values. **Check whether the
integration picks up the production keys on its own before overriding anything**; if it does not,
the `pk_live_` / `sk_live_` pair goes in as a Production-scoped override. Then redeploy.

### 10. Confirm it took

Fetch the live site and read the publishable key it serves. A `pk_live_` on `clerk.<domain>` means
it worked; a `pk_test_` on `clerk.accounts.dev` means step 9 did not take. Then sign in on a phone
— that was the whole reason for doing this.

## If something goes wrong

- **Sign-in loops after the switch.** Old development-instance cookies. Clear site data and retry.
- **DNS check fails while the record looks right.** If anything proxies the record, set it to
  DNS-only; Clerk validates by DNS lookup and a proxied record fails.
- **Certificate never issues.** CAA records, per step 8.
