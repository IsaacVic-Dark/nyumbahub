-- =====================================================================
-- Nyumba Hub — PostgreSQL schema
-- Reflects the end state after all migrations, up to
-- 2026_10_05_191559_make_counties_code_unique_for_active_rows_only.
-- Tables are ordered so every foreign key points at an existing table.
-- Note: Laravel's own `migrations` table is not included; `php artisan
-- migrate` creates it. If you load this file by hand, run
-- `php artisan migrate:install` and insert the batch rows yourself,
-- or just keep using migrations.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Framework tables
-- ---------------------------------------------------------------------

CREATE TABLE users (
    id                      BIGSERIAL PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    email                   VARCHAR(255) NOT NULL,
    email_verified_at       TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    password                VARCHAR(255) NOT NULL,
    remember_token          VARCHAR(100) NULL,
    created_at              TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at              TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    phone                   VARCHAR(255) NULL,
    phone_verified_at       TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    national_id_verified_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    is_verified_contributor BOOLEAN NOT NULL DEFAULT FALSE,
    trust_score             INTEGER NOT NULL DEFAULT 0,
    role                    VARCHAR(255) NOT NULL DEFAULT 'user',   -- 'user' | 'admin'
    deleted_at              TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_phone_unique UNIQUE (phone)
);

CREATE TABLE password_reset_tokens (
    email      VARCHAR(255) PRIMARY KEY,
    token      VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

CREATE TABLE sessions (
    id            VARCHAR(255) PRIMARY KEY,
    user_id       BIGINT NULL,
    ip_address    VARCHAR(45) NULL,
    user_agent    TEXT NULL,
    payload       TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);
CREATE INDEX sessions_user_id_index       ON sessions (user_id);
CREATE INDEX sessions_last_activity_index ON sessions (last_activity);

CREATE TABLE cache (
    key        VARCHAR(255) PRIMARY KEY,
    value      TEXT NOT NULL,
    expiration BIGINT NOT NULL
);
CREATE INDEX cache_expiration_index ON cache (expiration);

CREATE TABLE cache_locks (
    key        VARCHAR(255) PRIMARY KEY,
    owner      VARCHAR(255) NOT NULL,
    expiration BIGINT NOT NULL
);
CREATE INDEX cache_locks_expiration_index ON cache_locks (expiration);

CREATE TABLE jobs (
    id           BIGSERIAL PRIMARY KEY,
    queue        VARCHAR(255) NOT NULL,
    payload      TEXT NOT NULL,
    attempts     SMALLINT NOT NULL,
    reserved_at  INTEGER NULL,
    available_at INTEGER NOT NULL,
    created_at   INTEGER NOT NULL
);
CREATE INDEX jobs_queue_index ON jobs (queue);

CREATE TABLE job_batches (
    id             VARCHAR(255) PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    total_jobs     INTEGER NOT NULL,
    pending_jobs   INTEGER NOT NULL,
    failed_jobs    INTEGER NOT NULL,
    failed_job_ids TEXT NOT NULL,
    options        TEXT NULL,
    cancelled_at   INTEGER NULL,
    created_at     INTEGER NOT NULL,
    finished_at    INTEGER NULL
);

CREATE TABLE failed_jobs (
    id         BIGSERIAL PRIMARY KEY,
    uuid       VARCHAR(255) NOT NULL,
    connection TEXT NOT NULL,
    queue      TEXT NOT NULL,
    payload    TEXT NOT NULL,
    exception  TEXT NOT NULL,
    failed_at  TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid)
);
CREATE INDEX failed_jobs_connection_queue_failed_at_index
    ON failed_jobs (connection, queue, failed_at);

CREATE TABLE personal_access_tokens (
    id             BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id   BIGINT NOT NULL,
    name           TEXT NOT NULL,
    token          VARCHAR(64) NOT NULL,
    abilities      TEXT NULL,
    last_used_at   TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    expires_at     TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    created_at     TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at     TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT personal_access_tokens_token_unique UNIQUE (token)
);
CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index
    ON personal_access_tokens (tokenable_type, tokenable_id);
CREATE INDEX personal_access_tokens_expires_at_index
    ON personal_access_tokens (expires_at);

-- ---------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------

CREATE TABLE settings (
    id          BIGSERIAL PRIMARY KEY,
    key         VARCHAR(255) NOT NULL,
    value       VARCHAR(255) NOT NULL,
    description VARCHAR(255) NULL,
    created_at  TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at  TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT settings_key_unique UNIQUE (key)
);

-- ---------------------------------------------------------------------
-- Location hierarchy: counties -> towns -> estates -> sub_estates -> buildings
-- ---------------------------------------------------------------------

CREATE TABLE counties (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    code       VARCHAR(3) NULL,
    slug       VARCHAR(255) NOT NULL,
    latitude   DECIMAL(10, 7) NULL,
    longitude  DECIMAL(10, 7) NULL,
    CONSTRAINT counties_slug_unique UNIQUE (slug)
);
-- Code is unique only among active (non-soft-deleted) rows.
CREATE UNIQUE INDEX counties_code_active_unique
    ON counties (code) WHERE deleted_at IS NULL;

CREATE TABLE towns (
    id         BIGSERIAL PRIMARY KEY,
    county_id  BIGINT NOT NULL,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT towns_county_id_foreign
        FOREIGN KEY (county_id) REFERENCES counties (id) ON DELETE CASCADE
);

CREATE TABLE estates (
    id         BIGSERIAL PRIMARY KEY,
    town_id    BIGINT NOT NULL,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT estates_town_id_foreign
        FOREIGN KEY (town_id) REFERENCES towns (id) ON DELETE CASCADE
);

CREATE TABLE sub_estates (
    id                  BIGSERIAL PRIMARY KEY,
    estate_id           BIGINT NOT NULL,
    name                VARCHAR(255) NOT NULL,
    avg_security_rating DECIMAL(3, 2) NOT NULL DEFAULT 0,
    avg_power_rating    DECIMAL(3, 2) NOT NULL DEFAULT 0,
    avg_water_rating    DECIMAL(3, 2) NOT NULL DEFAULT 0,
    avg_network_rating  DECIMAL(3, 2) NOT NULL DEFAULT 0,
    ratings_count       INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at          TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at          TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT sub_estates_estate_id_foreign
        FOREIGN KEY (estate_id) REFERENCES estates (id) ON DELETE CASCADE
);

CREATE TABLE buildings (
    id            BIGSERIAL PRIMARY KEY,
    sub_estate_id BIGINT NOT NULL,
    name          VARCHAR(255) NOT NULL,
    directions    TEXT NULL,
    latitude      DECIMAL(10, 7) NULL,
    longitude     DECIMAL(10, 7) NULL,
    created_at    TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at    TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at    TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT buildings_sub_estate_id_foreign
        FOREIGN KEY (sub_estate_id) REFERENCES sub_estates (id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Phone OTPs
-- ---------------------------------------------------------------------

CREATE TABLE phone_otps (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NULL,
    phone       VARCHAR(255) NOT NULL,
    otp_code    VARCHAR(255) NOT NULL,   -- store hashed, never plaintext
    expires_at  TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    verified_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    created_at  TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at  TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT phone_otps_user_id_foreign
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------
-- Listings
-- ---------------------------------------------------------------------

CREATE TABLE listings (
    id                               BIGSERIAL PRIMARY KEY,
    user_id                          BIGINT NOT NULL,   -- the reporter
    building_id                      BIGINT NOT NULL,
    house_type                       VARCHAR(255) NOT NULL,
    last_monthly_rent                DECIMAL(10, 2) NOT NULL,
    deposit_amount                   DECIMAL(10, 2) NULL,
    move_out_date                    DATE NOT NULL,
    is_vacancy_confirmed_by_reporter BOOLEAN NOT NULL DEFAULT FALSE,
    directions                       TEXT NULL,
    status                           VARCHAR(255) NOT NULL DEFAULT 'upcoming_vacancy',
    archive_reason                   VARCHAR(255) NULL,
    expires_at                       TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    trust_score                      INTEGER NOT NULL DEFAULT 0,
    confirmed_count                  INTEGER NOT NULL DEFAULT 0,
    last_confirmed_at                TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    created_at                       TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at                       TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at                       TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT listings_user_id_foreign
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT listings_building_id_foreign
        FOREIGN KEY (building_id) REFERENCES buildings (id) ON DELETE CASCADE
);
CREATE INDEX listings_status_index             ON listings (status);
CREATE INDEX listings_building_id_status_index ON listings (building_id, status);

CREATE TABLE listing_conditions (
    id                         BIGSERIAL PRIMARY KEY,
    listing_id                 BIGINT NOT NULL,
    water                      TEXT NULL,
    electricity                TEXT NULL,
    internet                   TEXT NULL,
    plumbing                   TEXT NULL,
    kitchen                    TEXT NULL,
    walls_floors               TEXT NULL,
    natural_light              TEXT NULL,
    noise                      TEXT NULL,
    security                   TEXT NULL,
    parking                    TEXT NULL,
    garbage_collection         TEXT NULL,
    has_lift                   BOOLEAN NULL,
    pest_mould_leakage_history TEXT NULL,
    expected_hidden_costs      JSONB NULL,
    created_at                 TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at                 TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at                 TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT listing_conditions_listing_id_unique UNIQUE (listing_id),
    CONSTRAINT listing_conditions_listing_id_foreign
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE listing_reviews (
    id                      BIGSERIAL PRIMARY KEY,
    listing_id              BIGINT NOT NULL,
    lived_from              DATE NULL,
    lived_to                DATE NULL,
    pros                    TEXT NULL,
    cons                    TEXT NULL,
    how_repairs_handled     TEXT NULL,
    recurring_issues        TEXT NULL,
    rent_changed_during_stay BOOLEAN NOT NULL DEFAULT FALSE,
    reason_for_leaving      TEXT NULL,
    created_at              TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at              TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at              TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT listing_reviews_listing_id_unique UNIQUE (listing_id),
    CONSTRAINT listing_reviews_listing_id_foreign
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE listing_comments (
    id                BIGSERIAL PRIMARY KEY,
    listing_id        BIGINT NOT NULL,
    user_id           BIGINT NOT NULL,
    parent_comment_id BIGINT NULL,
    body              TEXT NOT NULL,
    relationship_tag  VARCHAR(255) NULL,   -- past_tenant | current_tenant | visitor
    created_at        TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at        TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at        TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT listing_comments_listing_id_foreign
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,
    CONSTRAINT listing_comments_user_id_foreign
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT listing_comments_parent_comment_id_foreign
        FOREIGN KEY (parent_comment_id) REFERENCES listing_comments (id) ON DELETE CASCADE
);
CREATE INDEX listing_comments_listing_id_index ON listing_comments (listing_id);

CREATE TABLE listing_media (
    id         BIGSERIAL PRIMARY KEY,
    listing_id BIGINT NOT NULL,
    type       VARCHAR(255) NOT NULL,   -- photo | video
    file_path  VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT listing_media_listing_id_foreign
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE listing_evidence (
    id          BIGSERIAL PRIMARY KEY,
    listing_id  BIGINT NOT NULL,
    type        VARCHAR(255) NOT NULL,   -- phone_otp | photo | video | receipt | agreement | national_id
    file_path   VARCHAR(255) NULL,
    status      VARCHAR(255) NOT NULL DEFAULT 'pending',   -- pending | verified | rejected
    verified_at TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    created_at  TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at  TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at  TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT listing_evidence_listing_id_foreign
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE TABLE community_confirmations (
    id                   BIGSERIAL PRIMARY KEY,
    listing_id           BIGINT NOT NULL,
    user_id              BIGINT NOT NULL,
    type                 VARCHAR(255) NOT NULL,
    -- still_vacant | new_tenant_moved_in | occupied | rent_changed |
    -- building_not_found | information_inaccurate
    reported_rent_amount DECIMAL(10, 2) NULL,
    evidence_id          BIGINT NULL,
    created_at           TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at           TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at           TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT community_confirmations_listing_id_foreign
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,
    CONSTRAINT community_confirmations_user_id_foreign
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT community_confirmations_evidence_id_foreign
        FOREIGN KEY (evidence_id) REFERENCES listing_evidence (id) ON DELETE SET NULL
);
CREATE INDEX community_confirmations_listing_id_type_index
    ON community_confirmations (listing_id, type);

-- Append-only audit trail: intentionally no deleted_at / updated_at.
CREATE TABLE listing_status_histories (
    id                 BIGSERIAL PRIMARY KEY,
    listing_id         BIGINT NOT NULL,
    from_status        VARCHAR(255) NULL,
    to_status          VARCHAR(255) NOT NULL,
    changed_by_user_id BIGINT NULL,
    changed_by_system  BOOLEAN NOT NULL DEFAULT FALSE,
    reason             TEXT NULL,
    created_at         TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT listing_status_histories_listing_id_foreign
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,
    CONSTRAINT listing_status_histories_changed_by_user_id_foreign
        FOREIGN KEY (changed_by_user_id) REFERENCES users (id) ON DELETE SET NULL
);
CREATE INDEX listing_status_histories_listing_id_index
    ON listing_status_histories (listing_id);

CREATE TABLE duplicate_flags (
    id                      BIGSERIAL PRIMARY KEY,
    listing_id              BIGINT NOT NULL,
    duplicate_of_listing_id BIGINT NOT NULL,
    flagged_by_user_id      BIGINT NULL,
    status                  VARCHAR(255) NOT NULL DEFAULT 'pending',   -- pending | confirmed | rejected
    created_at              TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at              TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at              TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT duplicate_flags_listing_id_foreign
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,
    CONSTRAINT duplicate_flags_duplicate_of_listing_id_foreign
        FOREIGN KEY (duplicate_of_listing_id) REFERENCES listings (id) ON DELETE CASCADE,
    CONSTRAINT duplicate_flags_flagged_by_user_id_foreign
        FOREIGN KEY (flagged_by_user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE flagged_contents (
    id                   BIGSERIAL PRIMARY KEY,
    flaggable_type       VARCHAR(255) NOT NULL,
    flaggable_id         BIGINT NOT NULL,
    flagged_by_user_id   BIGINT NOT NULL,
    reason               VARCHAR(255) NOT NULL,
    -- building_not_found | information_inaccurate | fraud | safety | duplicate | policy
    details              TEXT NULL,
    status               VARCHAR(255) NOT NULL DEFAULT 'open',   -- open | actioned | dismissed
    resolved_by_admin_id BIGINT NULL,
    resolved_at          TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    created_at           TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at           TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at           TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT flagged_contents_flagged_by_user_id_foreign
        FOREIGN KEY (flagged_by_user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT flagged_contents_resolved_by_admin_id_foreign
        FOREIGN KEY (resolved_by_admin_id) REFERENCES users (id) ON DELETE SET NULL
);
CREATE INDEX flagged_contents_flaggable_type_flaggable_id_index
    ON flagged_contents (flaggable_type, flaggable_id);
CREATE INDEX flagged_contents_status_index ON flagged_contents (status);

CREATE TABLE sub_estate_ratings (
    id             BIGSERIAL PRIMARY KEY,
    sub_estate_id  BIGINT NOT NULL,
    user_id        BIGINT NOT NULL,
    security_rating SMALLINT NOT NULL,
    power_rating    SMALLINT NOT NULL,
    water_rating    SMALLINT NOT NULL,
    network_rating  SMALLINT NOT NULL,
    created_at     TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    updated_at     TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    deleted_at     TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    CONSTRAINT sub_estate_ratings_sub_estate_id_foreign
        FOREIGN KEY (sub_estate_id) REFERENCES sub_estates (id) ON DELETE CASCADE,
    CONSTRAINT sub_estate_ratings_user_id_foreign
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT sub_estate_ratings_sub_estate_id_user_id_unique
        UNIQUE (sub_estate_id, user_id)
);

COMMIT;