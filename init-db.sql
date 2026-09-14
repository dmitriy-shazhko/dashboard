SET client_encoding = 'UTF8';

DROP DATABASE IF EXISTS dashboard;
CREATE DATABASE dashboard;

\connect dashboard

DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS orders;

CREATE TABLE customers (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    balance NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    birth_date DATE
);

CREATE TABLE orders (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),

    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);

INSERT INTO customers (name, balance, birth_date)
VALUES
    ('Иван', 20000, '1990-12-30'),
    ('Петр', 2000, '1999-10-03'),
    ('Мария', 123456, '1991-11-23'),
    ('Дмитрий', 1000000, '1989-05-22');


INSERT INTO orders (customer_id, product_name, price, order_date, quantity)
VALUES
    (4, 'Ноутбук', 30000, '2026-03-12', 1),
    (3, 'USB-флэшка', 500, '2026-06-10', 5);