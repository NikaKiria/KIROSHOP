CREATE TABLE users_table(
    user_id BIGINT UNIQUE AUTO_INCREMENT NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    user_password VARCHAR(50) NOT NULL,
    id_number BIGINT NOT NULL,
    user_address VARCHAR(64) NOT NULL,
    card_number VARCHAR(50),
    card_validity_period VARCHAR(50),
    cvc_cvv VARCHAR(50),
    user_create_date TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id)
) AUTO_INCREMENT = 3 CHARSET = utf8