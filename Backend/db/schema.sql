DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS stores CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255),
  store_address VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT current_timestamp,
  store_id INT REFERENCES stores(id),
  storeInfo VARCHAR(255)
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  coffee_type VARCHAR(255),
  size VARCHAR(255),
  price FLOAT,
  extras JSONB
);


