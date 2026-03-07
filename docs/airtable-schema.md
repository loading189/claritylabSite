# Airtable schema (active application usage)

This document captures **current Airtable tables actively read/written by the app** and the effective schema constraints enforced in code.

## Environment/table mapping

- `AIRTABLE_BASE_ID`: Airtable base ID used for all tables.
- `AIRTABLE_TABLE_NAME` (default `Leads`): lead capture table.
- `AIRTABLE_DIAGNOSTICS_TABLE` (fallback `AIRTABLE_SCAN_TABLE`, then `Diagnostics`).
- `AIRTABLE_CLIENTS_TABLE` (default `Clients`).
- `AIRTABLE_BOOKINGS_TABLE` (default `Bookings`).
- `AIRTABLE_FILES_TABLE` (default `Files`).
- `AIRTABLE_ENGAGEMENT_REQUESTS_TABLE` (default `Engagement Requests`).
- `AIRTABLE_INTAKES_TABLE` (default `Intakes`; used by intake flow).

---

## Diagnostics

**Purpose**: Persist scan submissions and retrieve latest diagnostic context for admin/client/booking workflows.

**Primary routes/features**:
- `POST /api/scan/submit`
- admin diagnostics list/detail and invite-from-diagnostic flow
- calendly webhook diagnostic context enrichment
- client engagement read model

| Field | Type | Required (app) | Accepted values/options | Notes |
|---|---|---:|---|---|
| `created_at` | datetime string | Required on write | ISO datetime | Sort key for latest records. |
| `name` | text | Optional | any | Scan submit payload only. |
| `email` | text/email | Required | lowercased email | Lookup via `LOWER({email})`. |
| `company` / `name` | text | Optional | any | Read model supports legacy `name` fallback. |
| `consent` | checkbox/bool | Required on scan write | `true`/`false` | Always true in scan submit. |
| `source` | single select/text | Optional but expected | `direct`, `business_card_qr`, `linkedin`, `google`, `local` (plus legacy) | Used for attribution. |
| `utm_source` | text | Optional | any | |
| `utm_medium` | text | Optional | any | |
| `utm_campaign` | text | Optional | any | |
| `score` | number | Required on scan write | numeric | Parsed defensively from string/number. |
| `tier` | single select/text | Required on scan write | current scorer output | Defaults to `monitor` on read fallback. |
| `primary_signal` / `primarySignal` | single select/text | Required on scan write | scorer output | Legacy camelCase read fallback supported. |
| `secondary_signal` / `secondarySignal` | single select/text | Optional | scorer output | Legacy camelCase read fallback supported. |
| `qualified` | checkbox/bool | Optional | true/false | Write path includes it. |
| `insights` | long text or array | Optional | string array preferred | Read path keeps string arrays only. |
| `answers_json` / `answers` | long text(JSON) | Required for full context | valid JSON string | Serialized via `safeJsonString` in scan route; read parser handles object/string safely. |

**Known fallback/normalization behavior**:
- If diagnostics table/env unavailable, scan submission returns fallback success and logs warning.
- Parse fallbacks exist for `primarySignal`, `secondarySignal`, and `answers` legacy shapes.

---

## Clients

**Purpose**: client identity + booking state; bridge between diagnostics and portal flows.

**Primary routes/features**:
- calendly webhook updates booking state
- admin invite from diagnostic
- files APIs ensure/list clients
- client engagement model (`getClientByEmail`)

| Field | Type | Required (app) | Accepted values/options | Notes |
|---|---|---:|---|---|
| `client_id` | text/uuid | Required for stable linking | UUID/string | Generated when creating records in app. |
| `primary_email` | text/email | Required | lowercased email | Primary lookup field. |
| `company` | text | Optional | any | Set from diagnostic if present. |
| `status` | single select | Required | `invited`, `active`, `booked`, `inactive` | Normalized before writes. |
| `latest_diagnostic_id` | text | Optional | Airtable record id | Set by invite-from-diagnostic flow. |
| `booked_start_time` | datetime string | Optional | ISO datetime | |
| `booked_end_time` | datetime string | Optional | ISO datetime | |
| `booked_timezone` | text | Optional | tz string | |
| `last_booking_id` | text | Optional | booking id | |
| `last_booking_status` | single select/text | Optional | `booked`, `canceled` | |
| `created_at` | datetime string | Required when app creates | ISO datetime | |

**Known fallback/normalization behavior**:
- `status` is normalized with fallback to `active`.
- email normalized to lowercase before write.

---

## Bookings

**Purpose**: durable calendly event records and dedupe.

**Primary routes/features**:
- `POST /api/webhooks/calendly`

| Field | Type | Required (app) | Accepted values/options | Notes |
|---|---|---:|---|---|
| `booking_id` | text | Required | derived composite id | dedupe key. |
| `client_email` | text/email | Required | lowercased email | normalized on write. |
| `client_id` | text | Optional | client id | populated if client update succeeded. |
| `status` | single select | Required | `booked`, `canceled` | normalized before write. |
| `start_time` | datetime string | Optional | ISO datetime | |
| `end_time` | datetime string | Optional | ISO datetime | |
| `timezone` | text | Optional | tz string | |
| `calendly_event_uri` | text/url | Optional | URI | |
| `calendly_invitee_uri` | text/url | Optional | URI | |
| `source` | single select | Required | `direct`, `business_card_qr`, `linkedin`, `google`, `local` | normalized before write. |
| `diagnostic_id` | text | Optional | record id | |
| `diagnostic_signal` | text | Optional | signal value | |
| `diagnostic_score` | number | Optional | numeric | |
| `diagnostic_tier` | text/select | Optional | scorer tier | |
| `created_at` | datetime string | Required | ISO datetime | defaults now if omitted. |

**Known fallback/normalization behavior**:
- Missing required write fields are logged as invalid payload and write is skipped with explicit error result.

---

## Files

**Purpose**: file vault uploads and report deliverables metadata.

**Primary routes/features**:
- `POST /api/client/files/record`
- client reports/files pages via read models

| Field | Type | Required (app) | Accepted values/options | Notes |
|---|---|---:|---|---|
| `client_id` | text | Required | string | |
| `client_email` | text/email | Required | lowercased email | normalized on write. |
| `uploader_role` | single select/text | Required | `client`, `admin` | |
| `uploader_user_id` | text | Required | string | |
| `category` | single select | Required | `upload`, `report`, `contract` | |
| `filename` | text | Required | any | |
| `storage_key` | text | Required | object key | unique practical identifier. |
| `mime_type` | text | Required | MIME string | |
| `size_bytes` | number | Required | integer | |
| `created_at` | datetime string | Required | ISO datetime | |
| `note` | long text | Optional | any | |
| `deliverable_type` | text/select | Optional | e.g. `report`, `weekly_update` | |
| `title` | text | Optional | any | display override. |
| `summary_note` | long text | Optional | any | |
| `period_covered` | text | Optional | any | |
| `visible_to_client` | checkbox/bool/text | Optional | true/false | Legacy bool-string tolerant parse on read. |
| `deliverable_visibility` | single select | Optional | `draft`, `internal`, `client_visible` (+ legacy aliases) | normalized to canonical values on write. |
| `report_publish_state` | single select | Optional | `draft`, `internal`, `client_visible` (+ legacy aliases) | canonical visibility field; normalized on write. |
| `report_published_at` | datetime string | Optional | ISO datetime | set when client-visible publish. |
| `report_content_json` | long text(JSON) | Optional | valid JSON string | serialized safely before write. |
| `status` | text/select | Optional | e.g. `delivered`, `shared` | |

**Known fallback/normalization behavior**:
- `visibleToClient/internalOnly` and similar legacy visibility aliases normalize to canonical publish states.
- `report_content_json` is sanitized to valid JSON string or empty string.
- missing required fields for create are logged explicitly and write is skipped.

---

## Engagement Requests

**Purpose**: actionable requests/tasks shown in client engagement dashboard.

**Primary routes/features**:
- client engagement model
- file record route can mark related request submitted

| Field | Type | Required (app) | Accepted values/options | Notes |
|---|---|---:|---|---|
| `client_id` / `clientId` | text | Required | string | required to map record. |
| `title` | text | Required | any | required to map record. |
| `category` | single select/text | Optional | `general`, `files`, `prep`, `booking` (observed) | defaults to `general`. |
| `status` | single select | Optional but expected | `open`, `submitted`, `reviewing`, `complete`, `in_progress`, `blocked` | legacy `done` -> `complete`, `in_review` -> `reviewing`; unknown -> `open`. |
| `due_date` / `dueDate` | date | Optional | ISO/date string | legacy camelCase read fallback. |
| `owner` | text | Optional | any | |
| `notes` | long text | Optional | any | |
| `created_at` / `createdAt` | datetime string | Optional | ISO datetime | defaults current timestamp in mapper fallback. |

**Known fallback/normalization behavior**:
- write path validates required fields (`clientId`, `title`) before write.
- status normalization keeps legacy values compatible.

---

## Leads

**Purpose**: marketing/contact/newsletter/resource lead capture.

**Primary routes/features**:
- `POST /api/leads`
- `POST /api/newsletter/subscribe`
- `POST /api/resources/request`
- intake flow lead upsert

Key fields used: `created_at`, `name`, `email`, `phone`, `company`, `industry`, `source`, `interest`, `pain_area`, `message`, `resource_slug`, `status`, `consent`.

Select-style accepted values from validation:
- `source`: `contact_form`, `audit_request`, `resource_download`, `chat`, `newsletter`
- `interest`: `audit`, `implementation`, `ongoing_support`, `unknown`
- `pain_area`: `ar_cashflow`, `scheduling`, `invoicing`, `tech_productivity`, `workflow_gaps`, `other`

---

## Intakes

**Purpose**: intake submissions (call/audit) and qualification metadata.

**Primary routes/features**:
- `POST /api/intake/call`
- `POST /api/intake/audit`

Key fields used on create include:
- company/contact metadata: `lead_email`, `lead_name`, `company`, `phone`, `website`, `location`, `industry`
- qualification inputs: `team_size`, `annual_revenue_range`, `current_tools`, `biggest_pain`, `problem_description`, `urgency`, `decision_maker`, `audit_goal`, `share_data`
- file metadata: `upload_preference`, `uploaded_files`, `uploaded_file_names`
- computed output: `qualification_score`, `qualification_tier`, `status`

Array-like fields are safely serialized as joined text to reduce type mismatches.

---

## Common schema mismatch failure patterns

1. **422 invalid payload**: field name mismatch, wrong type, or invalid single-select option. The Airtable adapter now logs request method/table/path and Airtable error details.
2. **403 forbidden**: token lacks table/base scope access.
3. **404 not found**: wrong table name or path.
4. **Silent bad data risk** from legacy variants: mitigated by explicit normalization for status/source/visibility fields and JSON serialization helpers.

## Recommended manual Airtable checks

1. Ensure single-select options include all canonical values documented above, especially:
   - bookings `source`, `status`
   - clients `status`
   - files `report_publish_state` / `deliverable_visibility`
   - engagement requests `status`
2. Confirm all required fields in write paths exist with compatible types.
3. Keep legacy alias fields (`primarySignal`, `secondarySignal`, `dueDate`, etc.) only if historical data needs them; app prefers snake_case canonical names.
