# Putting the app on a real domain

Written 30 October 2026. The point of this is not the nicer URL — it is that a Clerk
**production** instance needs a domain you control, and until it has one, sign-in runs on a
development instance that keeps its session in a querystring token and may not survive on iOS.
See item 13 in [BACKLOG.md](../BACKLOG.md) for why that matters.

**No application code changes.** Clerk reads its keys from the environment, the middleware
protects nothing, and the sign-in pages use relative paths. Nothing in `app/`, `lib/` or
`middleware.ts` has the current URL baked into it — this is all registrar, DNS and environment.

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

## The sequence

Steps marked **you** need an account only you can sign into. The rest can run from here.

### 1. Claim the domain — you

[education.github.com/pack](https://education.github.com/pack) → the Name.com offer → claim, and
pick the name. Nothing below works until this exists.

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
`clerk.<domain>`, same-site with the app, so sessions move to a normal `HttpOnly` cookie and the
iOS problem goes away.

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
