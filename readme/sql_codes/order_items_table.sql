CREATE TABLE order_items(
    order_item_id BIGINT UNIQUE AUTO_INCREMENT NOT NULL,
    order_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    item_price DECIMAL NOT NULL,
    item_special_price DECIMAL,
    item_category VARCHAR(50) NOT NULL,
    item_qty INT NOT NULL,
    PRIMARY KEY (order_item_id)
) AUTO_INCREMENT = 3 CHARSET = utf8