CREATE TABLE users(
	firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    user_password VARCHAR(50) NOT NULL,
    id_number BIGINT UNIQUE NOT NULL,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    user_address VARCHAR(50) NOT NULL,
    card_info JSON
)