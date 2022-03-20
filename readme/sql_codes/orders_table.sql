CREATE TABLE orders(
    order_id VARCHAR(50) UNIQUE NOT NULL,
    buyer_id VARCHAR(50) NOT NULL,
    address VARCHAR(50) NOT NULL,
    items JSON NOT NULL,
    create_date TIMESTAMP NOT NULL,
    total_price DECIMAL NOT NULL
)