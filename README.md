# Nyumba Hub — Application Documentation

**Version:** 2.0
**Stack:** Laravel (Eloquent) + PostgreSQL
**Companion files:** `nyumba-hub-schema.zip` (migrations + models), Figma workflow flowchart (v2), Figma ER diagram (v2)

---

## 1. Vision & Problem

House hunting in Nairobi and satellite towns is expensive (agent fees up to KES 2,000, sometimes scams), slow, and opaque. Landlords and agents have little incentive to publicly list vacant units. Nyumba Hub sidesteps this by building a **tenant-first** inventory: people who are moving out — not landlords or agents — post accurate "just vacated" reports with condition reports and honest reviews.

**No landlord, property manager, or agent is required to:** create listings, verify or claim listings, respond to reviews, manage availability, receive leads through the system, or pay for the service. Trust comes entirely from evidence, time, and the community — not from a paying party's cooperation.

---

## 2. Roles

| Role | Description |
|---|---|
| **Reporter (Contributor)** | A tenant who is moving out or has moved out and creates a listing. Can optionally verify their phone, ID, and submit evidence for a "Verified Contributor" badge. |
| **Seeker** | Anyone browsing listings, looking for a place to move into. Can leave community confirmations and comments; does not need to be verified to browse. |
| **Tenant-commenter** | Any past or current tenant of a building who wants to add color via the comment thread — separate from the reporter's own structured review. |
| **Admin** | Internal staff (`users.role = admin`). The only role that can resolve moderation flags and remove content. |

A single user account can hold multiple roles over time (e.g., someone who reported a listing last year can also be a seeker today).

---

## 3. Core Concepts

- **Listing** — a "Recently Vacated Home" report tied to one building. This is the unit of everything: status, condition report, review, comments, evidence, and confirmations all hang off a listing.
- **Building** — a physical structure, located inside a **Sub-Estate**, which sits inside an **Estate**, inside a **Town**, inside a **County**.
- **Sub-Estate** — a finer-grained neighborhood unit than "estate" (e.g., a specific block or zone within a larger estate), carrying crowd-sourced infrastructure ratings (security, power, water, network).
- **Evidence** — anything submitted to support a claim: OTP-verified phone, a photo/video, a blurred rent receipt or tenancy agreement, GPS confirmation, or (optionally) a national ID. Evidence documents are treated as encrypted-at-rest and are **never shown publicly**.
- **Trust Score** — a denormalized number on both `users` and `listings`, recomputed whenever a meaningful trust-relevant event occurs (see §7).
- **Community Confirmation** — a status update submitted by any seeker who visited or otherwise checked on a listing. The identity of the person confirming is **never shown publicly**, regardless of role.

---

## 4. End-to-End Workflow

### 4.1 Tenant Reporting
1. A tenant who is moving out (or has moved out) starts a report.
2. They provide: county/town/estate/sub-estate/building, house type, last known rent and deposit, move-out date (actual or expected), whether they personally confirmed vacancy, directions/landmarks.
3. They fill in the structured **condition report** (water, electricity, internet, plumbing, kitchen, walls/floors, natural light, noise, security, parking, garbage collection, lift, pest/mould/leakage history, expected hidden costs).
4. They fill in a structured **review** (dates lived, pros, cons, how repairs were handled, recurring issues, whether rent changed during their stay, reason for leaving).
5. They upload photos/video taken during tenancy or move-out.

### 4.2 Automated Verification (pre-publish)
Because a listing isn't public yet at this point, **no community verification happens here** — only automated checks:
- Phone number OTP verification.
- Evidence file(s) present and well-formed (photo/video, receipt, agreement).
- Optional GPS match against the building's stored coordinates.
- Optional national ID verification for a stronger badge.

If checks pass, the report **publishes**. If not, it's **held**, and the reporter is prompted for more evidence. Community input never gates the initial publish — it only helps keep a live listing accurate afterward.

### 4.3 Publishing & Discovery
Once published, a seeker finds the listing, visits the building/sub-estate independently, and contacts the caretaker, landlord, or agent themselves. **Nyumba Hub never brokers this contact or takes a fee from it.**

### 4.4 Comments (Open, Threaded)
Separate from the reporter's one structured review, **any past or current tenant** of the building can leave a comment on the listing — like a comment section on a post. Comments:
- Support threaded replies (a comment can reply to another comment).
- Are **not moderated** by default (no approval queue, no auto-flagging pipeline).
- Optionally self-tag the commenter's relationship to the property (past tenant / current tenant / visitor) — self-declared, not verified.

### 4.5 Community Confirmation
Any seeker who visits (or otherwise checks on) a listing can submit one of:

| Confirmation | What happens |
|---|---|
| **Still vacant** | Listing → `community_confirmed_vacant`; visibility window extended. |
| **New tenant moved in** (verified users only, agreement evidence required) | Listing → `occupied_pending_confirmation`. Needs **N independent confirmations** (default N = 2) before becoming `occupied`. See §4.5.1. |
| **Occupied** (unverified reporter, or no evidence) | Listing → `possibly_occupied` — a lighter-weight, unconfirmed signal. See §4.5.2. |
| **Rent changed** | Logged as a confirmation with the reported new figure. Only **applied** to the listing once N independent users report the *same* figure. See §4.5.3. |
| **Building could not be found** | Flags the location for admin review. |
| **Information inaccurate** | Flags the listing content for admin review. |

#### 4.5.1 Confirming genuine occupancy
Anyone can *claim* a unit is now occupied, but only a claim from a **phone-verified user with a signed tenancy-agreement upload** moves the listing into `occupied_pending_confirmation`. From there, the listing needs additional independent confirmations (from other users — ideally also verified) before flipping to the terminal `occupied` status. This two-layer gate (evidence + multiple confirmations) exists specifically to stop bad-faith actors from falsely marking a still-vacant unit as taken to suppress competition.

#### 4.5.2 "Possibly occupied" — the recommended design
A single unverified "it's occupied" report is a real but weak signal. Rather than merging it into the same bucket as a confirmed in-app move-in, it takes its own path:

- **`occupied`** (terminal, success) — reached only via the evidence + N-confirmation path in §4.5.1. This means the platform can claim credit for actually helping fill the vacancy.
- **`archived` with `archive_reason = occupied_other_channel`** (terminal, unconfirmed) — reached when a listing sits in `possibly_occupied` with no follow-up evidence within the timeout window. This covers the very common real-world case: the reporter found a new tenant off-platform, or simply forgot to update the app.

Keeping these separate protects a meaningful product metric (in-app conversions vs. general staleness) instead of collapsing every "not vacant anymore" outcome into one undifferentiated bucket.

#### 4.5.3 Rent-change consensus
A rent-change report from anyone other than the original reporter is **not applied automatically**. It's stored as a confirmation with the claimed new amount. A background job groups confirmations by reported figure; once **N independent users** (default N = 2, configurable) report the *same* number, the job updates `listings.last_monthly_rent` and writes an entry to the status/audit history. This prevents a single bad actor from unilaterally changing a listing's headline price.

### 4.6 Sub-Estate Ratings
Separately from any single listing, a **current or past tenant of a building within a sub-estate** can submit a one-time (editable) rating covering:
- Security
- Power reliability
- Water reliability
- Network/internet reliability

Each user has at most one rating row per sub-estate (they can update it later, not submit duplicates). The sub-estate's four displayed averages are recalculated whenever a rating is submitted or edited — this gives seekers a neighborhood-level signal independent of any specific vacant unit.

> **Assumption to confirm:** eligibility ("has lived there or lives there now") is currently enforced by requiring the user to already have some link to a building in that sub-estate — either as a listing reporter or a self-tagged tenant comment — rather than a separate document-upload verification flow. If you want stricter proof (e.g. requiring a lease/utility bill upload specifically for ratings), that's a straightforward addition to `sub_estate_ratings`.

### 4.7 Lifecycle & Expiry
Listings move through a time-boxed lifecycle so the inventory stays fresh:

| Status | Meaning | Trigger |
|---|---|---|
| `upcoming_vacancy` | Tenant has given notice, hasn't left yet | Reporter sets an expected move-out date in the future |
| `recently_vacated` | Tenant has moved out | Default state after publish |
| `community_confirmed_vacant` | Someone recently confirmed the unit is still open | A "still vacant" confirmation |
| `unconfirmed` | No recent confirmation — may be outdated | 14 days pass with no confirmation |
| `possibly_occupied` | A user reported it as occupied, unverified | Single/unverified occupancy report |
| `occupied_pending_confirmation` | Verified claim + evidence submitted, awaiting more confirmations | Verified user + agreement evidence |
| `occupied` | Confirmed filled via the platform (terminal, success) | N independent confirmations reached |
| `archived` | No longer actionable; see `archive_reason` | 30+ days stale, or occupied via another channel, or moderated, or duplicate |
| `removed` | Taken down for policy reasons | Admin action after moderation review |

`archive_reason` values: `expired`, `occupied_other_channel`, `moderated`, `duplicate`.

Every transition is written to an append-only `listing_status_histories` row (who changed it — a user or a system job — and why), so the full history of any listing is auditable.

### 4.8 Moderation
**Admins only** (`users.role = admin`) resolve items in the moderation queue. Community members can *flag* content ("building not found," "information inaccurate," or explicit fraud/safety/duplicate/policy reports), which lands in `flagged_contents`, but only an admin can mark it `actioned` (typically resulting in `removed`) or `dismissed`. Community flags surface the queue; they don't self-execute.

---

## 5. Database Schema Reference

Full DDL lives in the migrations bundle; this is the narrative map.

**Location hierarchy:** `counties → towns → estates → sub_estates → buildings`
**Ratings:** `sub_estate_ratings` (raw submissions) → denormalized onto `sub_estates` (`avg_security_rating`, `avg_power_rating`, `avg_water_rating`, `avg_network_rating`, `ratings_count`)

**Core listing tables:**
- `listings` — the report itself: house type, rent/deposit, dates, `status`, `archive_reason`, `expires_at`, denormalized `trust_score`, `confirmed_count`, `last_confirmed_at`
- `listing_conditions` (1:1) — the condition report, `expected_hidden_costs` as JSONB
- `listing_reviews` (1:1) — the reporter's own structured review
- `listing_comments` — open, threaded (`parent_comment_id` self-reference), any user, unmoderated
- `listing_media` — photos/videos
- `listing_evidence` — sensitive verification documents, encrypted at rest, never public
- `community_confirmations` — seeker check-ins driving the lifecycle above
- `listing_status_histories` — append-only audit trail of every status change
- `duplicate_flags` — cross-links a listing to a suspected duplicate
- `flagged_contents` — moderation queue, resolved only by admins

**Identity & access:**
- `users` — extended with `phone`, `phone_verified_at`, `national_id_verified_at`, `is_verified_contributor`, `trust_score`, `role`
- `phone_otps` — OTP issuance/verification log

See the Figma ER diagram (v2) for the full attribute-level layout and relationship cardinalities.

---

## 6. Business Rules Summary

| Rule | Value | Configurable? |
|---|---|---|
| Recently-vacated expiry | 14 days without confirmation → `unconfirmed` | Yes |
| Confirmation extension | +7 days visibility per "still vacant" confirmation | Yes |
| Archive threshold | 30 days stale → `archived` (`expired`) | Yes |
| Occupied confirmation threshold | N = 2 independent confirmations (after evidence) | Yes |
| Rent-change consensus threshold | N = 2 independent matching reports | Yes |
| Comment moderation | None — open by design | — |
| Sub-estate rating eligibility | Must be linked to a building in that sub-estate (see §4.6 assumption) | Under discussion |

---

## 7. Trust Score (conceptual)

Trust score is denormalized (not computed live on every read) and recalculated by an observer/job whenever a relevant event fires:

- **On `users`:** increases with phone/ID verification, evidence submissions later validated, and a track record of confirmations that held up over time.
- **On `listings`:** increases with reporter verification status, evidence completeness, number and recency of community confirmations, and decreases as a listing goes stale without reconfirmation.

---

## 8. Privacy & Security Notes

- **Evidence documents** (`listing_evidence`) are never exposed publicly and should sit behind encrypted storage — this includes ID documents, rent receipts, and tenancy agreements.
- **Confirmer/verifier identity** is never shown publicly on `community_confirmations` or ratings — the foreign key exists for backend abuse-detection only.
- **Comments** are open by design but still carry a `user_id` — if abuse becomes a problem later, a lightweight report mechanism can be layered on without changing the core table.

---

## 9. Open Items / To Confirm

1. Exact proof requirement for sub-estate rating eligibility (§4.6).
2. Default values for N (occupied confirmation, rent-change consensus) and the exact timeout window before `possibly_occupied` archives.
3. Whether `admin` needs sub-tiers (e.g. `moderator` vs `admin`) or a flat role is sufficient for now.
4. Whether comments ever need a lightweight user-facing "report" action, even without full moderation.

---

*This document reflects schema/workflow version 2 (sub-estates, open comments, occupied-confirmation gating, admin-only moderation, rent-change consensus). The originally generated migrations bundle reflects v1 and will need updating to match — let me know if you'd like that regenerated.*