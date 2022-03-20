CREATE TABLE products(
	product_id VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    price DECIMAL NOT NULL,
    special_price DECIMAL NOT NULL,
    stock INT NOT NULL,
    name_geo VARCHAR(50) NOT NULL,
    description_geo VARCHAR(1024),
    name_en VARCHAR(50),
    description_en VARCHAR(1024)
)