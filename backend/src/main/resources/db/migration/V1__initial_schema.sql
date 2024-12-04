-- Users table
CREATE TABLE users
(
	id            UUID PRIMARY KEY,
	email         VARCHAR(255) NOT NULL UNIQUE,
	password_hash VARCHAR(255),
	enabled       BOOLEAN      NOT NULL DEFAULT true,
	role          VARCHAR(50)  NOT NULL,
	created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'Table for storing user authentication details';
COMMENT ON COLUMN users.id IS 'Unique identifier for each user';
COMMENT ON COLUMN users.email IS 'User''s email address, must be unique';
COMMENT ON COLUMN users.password_hash IS 'Hashed password for user authentication';
COMMENT ON COLUMN users.enabled IS 'Indicates if the user account is active';
COMMENT ON COLUMN users.role IS 'Role assigned to the user (e.g., admin, editor, user)';
COMMENT ON COLUMN users.created_at IS 'Timestamp when the user was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when the user was last updated';

-- Social Connections table
CREATE TABLE social_connections
(
	user_id          UUID REFERENCES users (id),
	provider         VARCHAR(50)  NOT NULL,
	provider_user_id VARCHAR(255) NOT NULL,
	created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (user_id, provider),
	CONSTRAINT unique_provider_user UNIQUE (provider, provider_user_id)
);

COMMENT ON TABLE social_connections IS 'Table for storing social login connections';
COMMENT ON COLUMN social_connections.user_id IS 'Reference to the user in the users table';
COMMENT ON COLUMN social_connections.provider IS 'Social provider (e.g., Google, GitHub)';
COMMENT ON COLUMN social_connections.provider_user_id IS 'User ID provided by the social provider';
COMMENT ON COLUMN social_connections.created_at IS 'Timestamp when the social connection was created';

-- Refresh Tokens table
CREATE TABLE refresh_tokens
(
	id         UUID PRIMARY KEY,
	user_id    UUID REFERENCES users (id),
	token      VARCHAR(255) NOT NULL UNIQUE,
	expires_at TIMESTAMP    NOT NULL,
	created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE refresh_tokens IS 'Table for storing refresh tokens for authentication';
COMMENT ON COLUMN refresh_tokens.id IS 'Unique identifier for each refresh token';
COMMENT ON COLUMN refresh_tokens.user_id IS 'Reference to the user in the users table';
COMMENT ON COLUMN refresh_tokens.token IS 'Unique refresh token string';
COMMENT ON COLUMN refresh_tokens.expires_at IS 'Expiry time of the refresh token';
COMMENT ON COLUMN refresh_tokens.created_at IS 'Timestamp when the refresh token was created';

-- Posts table
CREATE TABLE posts
(
	id                UUID PRIMARY KEY,
	author_id         UUID REFERENCES users (id),
	title             VARCHAR(255) NOT NULL,
	slug              VARCHAR(255) NOT NULL UNIQUE,
	content           TEXT,
	excerpt           TEXT,
	status            VARCHAR(50)  NOT NULL,
	post_type         VARCHAR(50)  NOT NULL,
	featured_image_id UUID,
	created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
	meta_title        VARCHAR(255), -- SEO: ページタイトル
	meta_description  TEXT,         -- SEO: ページ説明
	meta_keywords     TEXT,         -- SEO: メタキーワード
	robots_meta_tag   VARCHAR(50),  -- SEO: robotsメタタグ
	canonical_url     VARCHAR(255), -- SEO: 正規URL
	og_title          VARCHAR(255), -- SEO: Open Graphタイトル
	og_description    TEXT,         -- SEO: Open Graph説明
	og_image          VARCHAR(255)  -- SEO: Open Graph画像
);

COMMENT ON TABLE posts IS 'Table for storing blog posts and related content';
COMMENT ON COLUMN posts.id IS 'Unique identifier for each post';
COMMENT ON COLUMN posts.author_id IS 'Reference to the author of the post';
COMMENT ON COLUMN posts.title IS 'Title of the post';
COMMENT ON COLUMN posts.slug IS 'Unique slug for the post, used in URLs';
COMMENT ON COLUMN posts.content IS 'Content of the post';
COMMENT ON COLUMN posts.excerpt IS 'Short excerpt of the post';
COMMENT ON COLUMN posts.status IS 'Status of the post (e.g., draft, published)';
COMMENT ON COLUMN posts.post_type IS 'Type of the post (e.g., blog, news)';
COMMENT ON COLUMN posts.featured_image_id IS 'Reference to the featured image in the media table';
COMMENT ON COLUMN posts.meta_title IS 'SEO title for the post';
COMMENT ON COLUMN posts.meta_description IS 'SEO description for the post';
COMMENT ON COLUMN posts.meta_keywords IS 'SEO keywords for the post';
COMMENT ON COLUMN posts.robots_meta_tag IS 'SEO robots meta tag for search engines';
COMMENT ON COLUMN posts.canonical_url IS 'SEO canonical URL to avoid duplicate content';
COMMENT ON COLUMN posts.og_title IS 'Open Graph title for social sharing';
COMMENT ON COLUMN posts.og_description IS 'Open Graph description for social sharing';
COMMENT ON COLUMN posts.og_image IS 'Open Graph image for social sharing';
COMMENT ON COLUMN posts.created_at IS 'Timestamp when the post was created';
COMMENT ON COLUMN posts.updated_at IS 'Timestamp when the post was last updated';

-- Revisions table
CREATE TABLE revisions
(
	id              UUID PRIMARY KEY,
	post_id         UUID REFERENCES posts (id),
	content         TEXT      NOT NULL,
	revision_number INTEGER   NOT NULL,
	created_by      UUID REFERENCES users (id),
	created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT unique_revision UNIQUE (post_id, revision_number)
);

COMMENT ON TABLE revisions IS 'Table for storing revisions of blog posts';
COMMENT ON COLUMN revisions.id IS 'Unique identifier for each revision';
COMMENT ON COLUMN revisions.post_id IS 'Reference to the post being revised';
COMMENT ON COLUMN revisions.content IS 'Content of the revision';
COMMENT ON COLUMN revisions.revision_number IS 'Revision number for tracking changes';
COMMENT ON COLUMN revisions.created_by IS 'Reference to the user who created the revision';
COMMENT ON COLUMN revisions.created_at IS 'Timestamp when the revision was created';

-- Taxonomies table
CREATE TABLE taxonomies
(
	id            UUID PRIMARY KEY,
	name          VARCHAR(255) NOT NULL,
	taxonomy_type VARCHAR(50)  NOT NULL,
	slug          VARCHAR(255) NOT NULL UNIQUE,
	description   TEXT,
	parent_id     UUID REFERENCES taxonomies (id),
	created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT unique_parent_id UNIQUE (parent_id)
);

COMMENT ON TABLE taxonomies IS 'Table for storing taxonomies like categories and tags';
COMMENT ON COLUMN taxonomies.id IS 'Unique identifier for each taxonomy';
COMMENT ON COLUMN taxonomies.name IS 'Name of the taxonomy (e.g., category, tag)';
COMMENT ON COLUMN taxonomies.taxonomy_type IS 'Type of the taxonomy (e.g., category, tag)';
COMMENT ON COLUMN taxonomies.slug IS 'Unique slug for the taxonomy, used in URLs';
COMMENT ON COLUMN taxonomies.description IS 'Description of the taxonomy';
COMMENT ON COLUMN taxonomies.parent_id IS 'Reference to the parent taxonomy, if applicable';
COMMENT ON COLUMN taxonomies.created_at IS 'Timestamp when the taxonomy was created';

-- Post-Taxonomies Relationship table
CREATE TABLE post_taxonomies
(
	post_id UUID REFERENCES posts (id), taxonomy_id UUID REFERENCES taxonomies (id), PRIMARY KEY (post_id, taxonomy_id)
);

COMMENT ON TABLE post_taxonomies IS 'Table for storing many-to-many relationships between posts and taxonomies';
COMMENT ON COLUMN post_taxonomies.post_id IS 'Reference to the post in the posts table';
COMMENT ON COLUMN post_taxonomies.taxonomy_id IS 'Reference to the taxonomy in the taxonomies table';

-- Media table
CREATE TABLE media
(
	id          UUID PRIMARY KEY,
	file_path   VARCHAR(255) NOT NULL,
	file_type   VARCHAR(50)  NOT NULL,
	file_size   BIGINT       NOT NULL,
	title       VARCHAR(255),
	alt_text    VARCHAR(255),
	uploaded_by UUID REFERENCES users (id),
	created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE media IS 'Table for storing media files like images and videos';
COMMENT ON COLUMN media.id IS 'Unique identifier for each media file';
COMMENT ON COLUMN media.file_path IS 'Path to the media file';
COMMENT ON COLUMN media.file_type IS 'Type of the media file (e.g., image, video)';
COMMENT ON COLUMN media.file_size IS 'Size of the media file in bytes';
COMMENT ON COLUMN media.title IS 'Title of the media file';
COMMENT ON COLUMN media.alt_text IS 'Alternative text for the media file, used for accessibility';
COMMENT ON COLUMN media.uploaded_by IS 'Reference to the user who uploaded the media';
COMMENT ON COLUMN media.created_at IS 'Timestamp when the media was uploaded';

-- Indexes
CREATE INDEX idx_posts_slug ON posts (slug);
CREATE INDEX idx_posts_status_type ON posts (status, post_type);
CREATE INDEX idx_revisions_post ON revisions (post_id, revision_number);
CREATE INDEX idx_taxonomies_slug ON taxonomies (slug);
CREATE INDEX idx_post_taxonomies_taxonomy ON post_taxonomies (taxonomy_id);
