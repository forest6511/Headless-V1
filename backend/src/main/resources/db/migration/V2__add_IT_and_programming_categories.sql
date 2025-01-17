-- =========================================
-- V2__add_IT_and_programming_categories.sql
-- =========================================

-- IT トップカテゴリ
INSERT INTO categories (
    id,
    slug,
    parent_id,
    created_at
)
VALUES (
    '019475cc-6c7d-7500-a845-c925e66bb132',
    'it',
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
VALUES
(
    '019475cc-6c7d-7500-a845-c925e66bb132',
    'ja',
    'IT',
    'ITに関する記事のカテゴリ',
    CURRENT_TIMESTAMP
),
(
    '019475cc-6c7d-7500-a845-c925e66bb132',
    'en',
    'IT',
    'Category for information technology articles',
    CURRENT_TIMESTAMP
);

-- プログラミング（IT の子カテゴリ）
INSERT INTO categories (
    id,
    slug,
    parent_id,
    created_at
)
VALUES (
    '019475ce-9c6f-7b7a-b58f-7ad9c890ae96',
    'programming',
    '019475cc-6c7d-7500-a845-c925e66bb132',
    CURRENT_TIMESTAMP
);

-- プログラミングカテゴリの日本語と英語
INSERT INTO category_translations (
    category_id,
    language,
    name,
    description,
    created_at
)
VALUES
(
    '019475ce-9c6f-7b7a-b58f-7ad9c890ae96',
    'ja',
    'プログラミング',
    'プログラミング関連の記事をまとめるカテゴリ',
    CURRENT_TIMESTAMP
),
(
    '019475ce-9c6f-7b7a-b58f-7ad9c890ae96',
    'en',
    'Programming',
    'Articles related to programming',
    CURRENT_TIMESTAMP
);