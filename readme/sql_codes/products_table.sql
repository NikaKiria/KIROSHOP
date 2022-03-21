CREATE TABLE products(
	product_id BIGINT UNIQUE AUTO_INCREMENT NOT NULL,
	category VARCHAR(50) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    price DECIMAL NOT NULL,
    special_price DECIMAL,
    stock INT NOT NULL,
    name_geo VARCHAR(50) NOT NULL,
    description_geo VARCHAR(1024),
    name_en VARCHAR(50),
    description_en VARCHAR(1024),
    create_date TIMESTAMP NOT NULL,
    PRIMARY KEY (product_id)
) AUTO_INCREMENT = 3 CHARSET = utf8