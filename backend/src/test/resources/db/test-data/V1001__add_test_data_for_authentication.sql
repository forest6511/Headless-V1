-- PostgreSQLでpgcrypto拡張を有効にする
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- PostgreSQLでpgcrypto拡張を有効にする
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (id,
                   email,
                   password_hash,
                   enabled,
                   role,
                   created_at,
                   updated_at)
VALUES (gen_random_uuid(),
        'test@example.com',
        '$2a$08$VLeADulrnHJaVTxMblPNr.WnqwbsOGdVKag4cfFTREX6d1eob1sfm',
        true,
        'USER',
        '2024-12-02 01:43:07',
        '2024-12-02 01:43:07'),
       (gen_random_uuid(),
        'admin@example.com',
        '$2a$08$vVmkamxUEiV/2OwynyGMFOyIK68NgdwXsefGBE96ykC91rcE0glKC',
        true,
        'ADMIN',
        '2024-12-02 01:43:07',
        '2024-12-02 01:43:07'),
       (gen_random_uuid(),
        'admin-enable-fale@example.com',
        '$2a$08$vVmkamxUEiV/2OwynyGMFOyIK68NgdwXsefGBE96ykC91rcE0glKC',
        false,
        'ADMIN',
        '2024-12-02 01:43:07',
        '2024-12-02 01:43:07');
