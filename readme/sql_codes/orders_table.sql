CREATE TABLE orders(
	order_id BIGINT UNIQUE AUTO_INCREMENT NOT NULL,
	buyer_id BIGINT NOT NULL,
    address VARCHAR(64) NOT NULL,
    create_date TIMESTAMP NOT NULL,
    total_price DECIMAL NOT NULL,
    delivery_price DECIMAL NOT NULL,
    total_to_pay DECIMAL NOT NULL,
    PRIMARY KEY (order_id)
) AUTO_INCREMENT = 3 CHARSET = utf8