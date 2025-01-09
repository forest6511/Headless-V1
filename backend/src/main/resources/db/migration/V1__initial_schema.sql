-- Users table
CREATE TABLE users
(
    id            uuid PRIMARY KEY,
    email         varchar(255) NOT NULL UNIQUE,
    password_hash varchar(255),
    enabled       boolean      NOT NULL DEFAULT FALSE,
    role          varchar(50)  NOT NULL,
    created_at    timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'Table for storing user authentication details';
COMMENT ON COLUMN users.id IS 'Unique identifier for each user';
COMMENT ON COLUMN users.email IS 'User''s email address, must be unique';
COMMENT ON COLUMN users.password_hash IS 'Hashed password for user authentication';
COMMENT ON COLUMN users.enabled IS 'Default is false. Automatically set to true after user verification';
COMMENT ON COLUMN users.role IS 'Role assigned to the user (e.g., admin, editor, user)';
COMMENT ON COLUMN users.created_at IS 'Timestamp when the user was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when the user was last updated';

-- Social Connections table
CREATE TABLE social_connections
(
    user_id          uuid REFERENCES users (id),
    provider         varchar(50)  NOT NULL,
    provider_user_id varchar(255) NOT NULL,
    created_at       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    id         uuid PRIMARY KEY,
    user_id    uuid REFERENCES users (id),
    token      varchar(255) NOT NULL UNIQUE,
    expires_at timestamp    NOT NULL,
    created_at timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE refresh_tokens IS 'Table for storing refresh tokens for authentication';
COMMENT ON COLUMN refresh_tokens.id IS 'Unique identifier for each refresh token';
COMMENT ON COLUMN refresh_tokens.user_id IS 'Reference to the user in the users table';
COMMENT ON COLUMN refresh_tokens.token IS 'Unique refresh token string';
COMMENT ON COLUMN refresh_tokens.expires_at IS 'Expiry time of the refresh token';
COMMENT ON COLUMN refresh_tokens.created_at IS 'Timestamp when the refresh token was created';

-- Media table
CREATE TABLE medias
(
    id             uuid PRIMARY KEY,
    title          varchar(255),
    alt_text       varchar(255),
    uploaded_by    uuid REFERENCES users (id),
    thumbnail_url  varchar(255) NOT NULL,
    thumbnail_size bigint       NOT NULL,
    small_url      varchar(255) NOT NULL,
    small_size     bigint       NOT NULL,
    medium_url     varchar(255) NOT NULL,
    medium_size    bigint       NOT NULL,
    created_at     timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE medias IS 'Table for storing media files like images and videos with multiple size URLs and their sizes';

COMMENT ON COLUMN medias.id IS 'Unique identifier for each media file';
COMMENT ON COLUMN medias.title IS 'Optional title or description for the media file';
COMMENT ON COLUMN medias.alt_text IS 'Alternative text for the media file, used for accessibility or when the image cannot be displayed';
COMMENT ON COLUMN medias.uploaded_by IS 'UUID of the user who uploaded the media file, referencing the users table';
COMMENT ON COLUMN medias.thumbnail_url IS 'URL of the thumbnail version of the media file';
COMMENT ON COLUMN medias.thumbnail_size IS 'File size of the thumbnail version in bytes';
COMMENT ON COLUMN medias.small_url IS 'URL of the small version of the media file';
COMMENT ON COLUMN medias.small_size IS 'File size of the small version in bytes';
COMMENT ON COLUMN medias.medium_url IS 'URL of the medium version of the media file';
COMMENT ON COLUMN medias.medium_size IS 'File size of the medium version in bytes';
COMMENT ON COLUMN medias.created_at IS 'Timestamp when the media file was uploaded';

-- Posts table
CREATE TABLE posts
(
    id                uuid PRIMARY KEY,
    slug              varchar(255) NOT NULL UNIQUE,
    status            varchar(10)  NOT NULL,
    featured_image_id uuid REFERENCES medias (id),
    created_at        timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE posts IS 'Table for storing blog posts (common info)';

COMMENT ON COLUMN posts.id IS 'Unique identifier for each post (UUID)';
COMMENT ON COLUMN posts.slug IS 'Unique slug for the post, used in URLs';
COMMENT ON COLUMN posts.status IS 'Status of the post (e.g., DRAFT, PUBLISHED)';
COMMENT ON COLUMN posts.featured_image_id IS 'Reference to the featured image in the media table, if applicable';
COMMENT ON COLUMN posts.created_at IS 'Timestamp when the post was created';
COMMENT ON COLUMN posts.updated_at IS 'Timestamp when the post was last updated';

CREATE TABLE post_translations
(
    post_id          uuid         NOT NULL,
    language    varchar(5)   NOT NULL,
    title            varchar(255) NOT NULL,
    excerpt          varchar(510) NOT NULL,
    content          text         NOT NULL,
    created_at       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- 複合主キーとする (同じ post_id + language の組み合わせは1つだけ)
    PRIMARY KEY (post_id, language)
);

COMMENT ON TABLE post_translations IS 'Table for storing language-specific fields of each post';

COMMENT ON COLUMN post_translations.post_id IS 'Reference to posts.id (the main post ID)';
COMMENT ON COLUMN post_translations.language IS 'Language code (e.g., ja, en)';
COMMENT ON COLUMN post_translations.title IS 'Post title for the given language';
COMMENT ON COLUMN post_translations.excerpt IS 'Short excerpt of the post for the given language';
COMMENT ON COLUMN post_translations.content IS 'Content of the post for the given language';
COMMENT ON COLUMN post_translations.created_at IS 'Timestamp when the translation record was created';
COMMENT ON COLUMN post_translations.updated_at IS 'Timestamp when the translation record was last updated';

-- Categories table
CREATE TABLE categories
(
    id         uuid PRIMARY KEY,
    slug       varchar(255) NOT NULL UNIQUE,
    parent_id  uuid REFERENCES categories (id),
    created_at timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE categories IS 'Table for storing categories';
COMMENT ON COLUMN categories.id IS 'Unique identifier for each category';
COMMENT ON COLUMN categories.slug IS 'Unique slug for the category, used in URLs';
COMMENT ON COLUMN categories.parent_id IS 'Reference to the parent category for hierarchical categorization';
COMMENT ON COLUMN categories.created_at IS 'Timestamp when the category was created';
COMMENT ON COLUMN categories.updated_at IS 'Timestamp when the category was last updated';

CREATE TABLE category_translations
(
    category_id  uuid       NOT NULL,
    language     varchar(5) NOT NULL,
    name         varchar(255) NOT NULL,
    description  varchar(255),
    created_at   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- 複合主キーとする (同じ post_id + language の組み合わせは1つだけ)
    PRIMARY KEY (category_id, language),
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

COMMENT ON TABLE category_translations IS 'Table for storing language-specific fields of each category';

COMMENT ON COLUMN category_translations.category_id IS 'Reference to categories.id';
COMMENT ON COLUMN category_translations.language IS 'Language code (e.g., ja, en)';
COMMENT ON COLUMN category_translations.name IS 'Category name in the given language';
COMMENT ON COLUMN category_translations.description IS 'Description of the category in the given language';
COMMENT ON COLUMN category_translations.created_at IS 'Timestamp when the translation record was created';
COMMENT ON COLUMN category_translations.updated_at IS 'Timestamp when the translation record was last updated';

-- Categories tags
CREATE TABLE tags
(
    id         uuid PRIMARY KEY,
    name       varchar(255) NOT NULL UNIQUE,
    slug       varchar(255) NOT NULL UNIQUE,
    created_at timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE tags IS 'Table for storing tags';
COMMENT ON COLUMN tags.id IS 'Unique identifier for each tag';
COMMENT ON COLUMN tags.name IS 'Name of the tag';
COMMENT ON COLUMN tags.slug IS 'Unique slug for the tag, used in URLs';
COMMENT ON COLUMN tags.created_at IS 'Timestamp when the tag was created';

-- Post-Categories Relationship table
CREATE TABLE post_categories
(
    post_id     uuid REFERENCES posts (id),
    category_id uuid REFERENCES categories (id),
    PRIMARY KEY (post_id, category_id)
);

COMMENT ON TABLE post_categories IS 'Table for storing many-to-many relationships between posts and categories';
COMMENT ON COLUMN post_categories.post_id IS 'Reference to the post in the posts table';
COMMENT ON COLUMN post_categories.category_id IS 'Reference to the category in the category table';

-- Post-Tags Relationship table
CREATE TABLE post_tags
(
    post_id uuid REFERENCES posts (id),
    tag_id  uuid REFERENCES tags (id),
    PRIMARY KEY (post_id, tag_id)
);

COMMENT ON TABLE post_tags IS 'Table for storing many-to-many relationships between posts and tags';
COMMENT ON COLUMN post_tags.post_id IS 'Reference to the post in the posts table';
COMMENT ON COLUMN post_tags.tag_id IS 'Reference to the tag in the tags table';

-- API Quotas table
CREATE TABLE api_quota_logs (
    id uuid PRIMARY KEY,
    service varchar(50) NOT NULL,
    quota_date date NOT NULL,
    daily_quota integer NOT NULL DEFAULT 0,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_service_date UNIQUE (service, quota_date)
);

COMMENT ON TABLE api_quota_logs IS 'Table for tracking daily API usage quotas';
COMMENT ON COLUMN api_quota_logs.id IS 'Unique identifier for each quota log';
COMMENT ON COLUMN api_quota_logs.service IS 'Name of the API service (e.g., gemini)';
COMMENT ON COLUMN api_quota_logs.quota_date IS 'The date of this quota record';
COMMENT ON COLUMN api_quota_logs.daily_quota IS 'Count of API calls for the specific date';
COMMENT ON COLUMN api_quota_logs.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN api_quota_logs.updated_at IS 'Timestamp when the record was last updated';

-- Indexes
CREATE INDEX idx_posts_slug ON posts (slug);
CREATE INDEX idx_posts_status ON posts (status);
CREATE INDEX idx_categories_slug ON categories (slug);
CREATE INDEX idx_post_categories_category ON post_categories (category_id);
CREATE INDEX idx_post_categories_post ON post_categories (post_id);
CREATE INDEX idx_post_tags_post ON post_tags (post_id);
CREATE INDEX idx_post_tags_tag ON post_tags (tag_id);
CREATE INDEX idx_post_translations_language ON post_translations (language);
CREATE INDEX idx_api_quota_logs_service ON api_quota_logs (service);
CREATE INDEX idx_api_quota_logs_date ON api_quota_logs (quota_date);
CREATE INDEX idx_api_quota_logs_service_date ON api_quota_logs (service, quota_date);


-- 外部キー (posts.id を参照)。投稿が削除されたら翻訳も削除
ALTER TABLE post_translations
    ADD CONSTRAINT fk_post_translations_posts FOREIGN KEY (post_id)
    REFERENCES posts (id) ON DELETE CASCADE;

-- 外部キー (categories.id を参照)。カテゴリが削除されたら翻訳も削除
ALTER TABLE category_translations
    ADD CONSTRAINT fk_category_translations_categories FOREIGN KEY (category_id)
    REFERENCES categories (id) ON DELETE CASCADE;

-- Insert the specified data into the categories table
INSERT INTO categories (
    id,
    slug,
    parent_id,
    created_at
)
VALUES (
    '01939280-7ccb-72a8-9257-7ba44de715b6',
    'nosetting',
    NULL,
    CURRENT_TIMESTAMP
);

INSERT INTO category_translations (
    category_id,
    language,
    name,
    description,
    created_at
)
VALUES (
    '01939280-7ccb-72a8-9257-7ba44de715b6',
    'ja',
    '未設定',
    '未設定カテゴリ',
    CURRENT_TIMESTAMP
);

INSERT INTO category_translations (
    category_id,
    language,
    name,
    description,
    created_at
)
VALUES (
    '01939280-7ccb-72a8-9257-7ba44de715b6',
    'en',
    'No Setting',
    'No Setting category',
    CURRENT_TIMESTAMP
);

INSERT INTO posts (
    id,
    slug,
    status,
    featured_image_id,
    created_at,
    updated_at
)
VALUES (
    '018df485-3cf2-7960-8000-66d818e6826b',
    'first-post',
    'DRAFT',
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- post_translations
INSERT INTO post_translations (
    post_id,
    language,
    title,
    excerpt,
    content,
    created_at,
    updated_at
)
VALUES (
    '018df485-3cf2-7960-8000-66d818e6826b',
    'ja',
    '最初のブログ投稿',
    '最初のブログ投稿です。マークダウンやHTMLタグを使い、太字、斜体、ハイライトなどを活用できます。簡単な記事内容とサンプル画像、箇条書きと番号付きリストの例を示しています。',
    '<h2 class="cms">見出し</h2><p class="cms">これは最初のブログ投稿の本文です。 マークダウンや HTML タグを含めることができます。</p><p class="cms">たとえば、太字や斜体、<mark class="cms" data-color="#fecdd3" style="background-color: #fecdd3; color: inherit">ハイライト</mark>などを活用できます。</p><h3 class="cms">簡単な記事内容</h3><p class="cms">ここには実際の記事内容を簡単に書きます。</p><h3 class="cms">記事画像イメージ</h3><p class="cms">下記の画像はサンプルです。</p><p class="cms"><img class="cms" src="https://placehold.jp/150x150.png"></p><p class="cms"><strong class="cms">UL / LI のサンプル</strong></p><ul class="cms"><li class="cms">まずはリストの１項目です</li><li class="cms">次の項目には詳細を記述できます</li><li class="cms">リストを使うと、要点を整理して伝えやすくなります</li></ul><p class="cms"><strong class="cms">OL / LI のサンプル</strong></p><ol class="cms"><li class="cms">これは番号付きリストの最初の項目です</li><li class="cms">次の項目も順番を意識して並べることができます</li><li class="cms">手順やステップを示すのに最適です</li></ol><p class="cms"><strong class="cms">簡単なサンプルコーディング</strong></p><pre class="cms"><code>console.log("Hello, world!");

function greet(name) {
	 console.log(`Hello, ${name}!`);
}

greet("Alice");  // "Hello, Alice!" と表示されます</code></pre>',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO post_translations (
    post_id,
    language,
    title,
    excerpt,
    content,
    created_at,
    updated_at
)
VALUES (
    '018df485-3cf2-7960-8000-66d818e6826b',  -- 同じ post_id
    'en',                                   -- 英語
    'First Blog Post',                      -- タイトル
    'This is the first blog post. It demonstrates how to use Markdown and HTML tags, such as bold, italics, or highlights. It includes a brief article content, a sample image, and examples of bullet and numbered lists.',
    '<h2 class="cms">Heading</h2><p class="cms">This is the first blog post. You can include Markdown or HTML tags.</p><p class="cms">For instance, you can use bold, italics, or a <mark class="cms" data-color="#fecdd3" style="background-color: #fecdd3; color: inherit">highlight</mark>.</p><h3 class="cms">Brief Article Content</h3><p class="cms">Here you can write a concise overview of the content.</p><h3 class="cms">Article Image</h3><p class="cms">The following is a sample image.</p><p class="cms"><img class="cms" src="https://placehold.jp/150x150.png"></p><p class="cms"><strong class="cms">UL / LI Sample</strong></p><ul class="cms"><li class="cms">This is the first list item</li><li class="cms">You can add more details in subsequent items</li><li class="cms">Using lists helps organize key points effectively</li></ul><p class="cms"><strong class="cms">OL / LI Sample</strong></p><ol class="cms"><li class="cms">This is the first item in a numbered list</li><li class="cms">Subsequent items follow in order</li><li class="cms">Numbered lists are ideal for showing steps or sequences</li></ol><p class="cms"><strong class="cms">Simple Coding Sample</strong></p><pre class="cms"><code>console.log("Hello, world!");

function greet(name) {
    console.log(`Hello, ${name}!`);
}

greet("Alice");  // "Hello, Alice!" is displayed</code></pre>',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- post_categoriesテーブルに未設定カテゴリとの関連付けを挿入
INSERT INTO post_categories (
    post_id,
    category_id
) VALUES (
    '018df485-3cf2-7960-8000-66d818e6826b',
    '01939280-7ccb-72a8-9257-7ba44de715b6'
);