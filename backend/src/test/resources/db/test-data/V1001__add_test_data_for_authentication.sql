-- PostgreSQLでpgcrypto拡張を有効にする
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- PostgreSQLでpgcrypto拡張を有効にする
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (id,
    email,
    password_hash,
    enabled,
    role,
    nickname,
    thumbnail_url,
    language,
    created_at,
    updated_at
)
VALUES
(
    gen_random_uuid(),
    'test@example.com',
    '$2a$08$VLeADulrnHJaVTxMblPNr.WnqwbsOGdVKag4cfFTREX6d1eob1sfm',
    true,
    'USER',
    'test-user1',
    'test-user1.png',
    'ja',
    '2024-12-02 01:43:07',
    '2024-12-02 01:43:07'),
(
    gen_random_uuid(),
    'admin@example.com',
    '$2a$08$vVmkamxUEiV/2OwynyGMFOyIK68NgdwXsefGBE96ykC91rcE0glKC',
    true,
    'ADMIN',
    'admin-user1',
    'admin-user1.png',
    'ja',
    '2024-12-02 01:43:07',
    '2024-12-02 01:43:07'),
(
    gen_random_uuid(),
    'admin-enable-fale@example.com',
    '$2a$08$vVmkamxUEiV/2OwynyGMFOyIK68NgdwXsefGBE96ykC91rcE0glKC',
    false,
    'ADMIN',
    'admin-user2',
    'admin-user2.png',
    'ja',
    '2024-12-02 01:43:07',
    '2024-12-02 01:43:07'
);
