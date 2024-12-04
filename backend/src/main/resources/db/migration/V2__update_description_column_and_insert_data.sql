-- Update the description column to restrict it to 100 characters
ALTER TABLE taxonomies
ALTER
COLUMN description TYPE VARCHAR(100);

-- Insert the specified data into the taxonomies table
INSERT INTO taxonomies (id,
                        taxonomy_type,
                        name,
                        slug,
                        description,
                        parent_id,
                        created_at)
VALUES ('01939280-7ccb-72a8-9257-7ba44de715b6',
        'CATEGORY',
        '未設定',
        'nosetting',
        '未設定カテゴリ',
        NULL,
        CURRENT_TIMESTAMP);
