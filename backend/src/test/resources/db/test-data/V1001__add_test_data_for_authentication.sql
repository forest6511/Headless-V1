-- PostgreSQLでpgcrypto拡張を有効にする
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- PostgreSQLでpgcrypto拡張を有効にする
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users(
	id,
	email,
	password_hash,
	role,
	created_at,
	updated_at
)
VALUES(
	      gen_random_uuid(),
	      'test@example.com',
	      -- incorrect_password
	      '$2a$08$VLeADulrnHJaVTxMblPNr.WnqwbsOGdVKag4cfFTREX6d1eob1sfm',
	      'USER',
	      '2024-12-02 01:43:07',
	      '2024-12-02 01:43:07'
      ),
      (
	      gen_random_uuid(),
	      'admin@example.com',
        -- correct_password
	      '$2a$08$vVmkamxUEiV/2OwynyGMFOyIK68NgdwXsefGBE96ykC91rcE0glKC',
	      'ADMIN',
	      '2024-12-02 01:43:07',
	      '2024-12-02 01:43:07'
      )
;