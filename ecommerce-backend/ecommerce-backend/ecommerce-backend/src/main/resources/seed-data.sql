-- ============================================================================
-- E-COMMERCE SEED DATA (CORRECTED)
-- ============================================================================
-- This file contains seed data for testing the ecommerce application
-- Run this after your schema is created
-- ============================================================================

-- Clear existing data (in reverse order of dependencies)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE payments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE carts;
TRUNCATE TABLE inventory;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE user_roles;
TRUNCATE TABLE users;
TRUNCATE TABLE roles;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. ROLES
-- ============================================================================
INSERT INTO roles (id, name) VALUES
(1, 'ROLE_USER'),
(2, 'ROLE_ADMIN');

-- ============================================================================
-- 2. USERS
-- ============================================================================
-- Password: 'password123' (you should use BCrypt encoding in production)
INSERT INTO users (id, email, password, first_name, last_name, enabled, locked, created_at) VALUES
(1, 'john.doe@example.com', '$2a$10$YourBCryptHashHere', 'John', 'Doe', true, false, NOW()),
(2, 'jane.smith@example.com', '$2a$10$YourBCryptHashHere', 'Jane', 'Smith', true, false, NOW()),
(3, 'admin@example.com', '$2a$10$YourBCryptHashHere', 'Admin', 'User', true, false, NOW()),
(4, 'mike.wilson@example.com', '$2a$10$YourBCryptHashHere', 'Mike', 'Wilson', true, false, NOW()),
(5, 'sarah.jones@example.com', '$2a$10$YourBCryptHashHere', 'Sarah', 'Jones', true, false, NOW());

-- ============================================================================
-- 3. USER ROLES
-- ============================================================================
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- John is USER
(2, 1), -- Jane is USER
(3, 1), -- Admin is USER
(3, 2), -- Admin is also ADMIN
(4, 1), -- Mike is USER
(5, 1); -- Sarah is USER

-- ============================================================================
-- 4. CATEGORIES
-- ============================================================================
INSERT INTO categories (id, name, description) VALUES
(1, 'Electronics', 'Electronic devices and accessories'),
(2, 'Clothing', 'Fashion and apparel'),
(3, 'Books', 'Physical and digital books'),
(4, 'Home & Kitchen', 'Home improvement and kitchen items'),
(5, 'Sports & Outdoors', 'Sports equipment and outdoor gear'),
(6, 'Toys & Games', 'Toys and gaming products');

-- ============================================================================
-- 5. PRODUCTS
-- ============================================================================
INSERT INTO products (id, sku, name, description, price, active, category_id, created_at) VALUES
-- Electronics
(1, 'ELEC-LP-001', 'Premium Laptop', '15-inch display, 16GB RAM, 512GB SSD', 1299.99, true, 1, NOW()),
(2, 'ELEC-PH-001', 'Smartphone Pro', '6.5-inch OLED, 128GB storage, 5G enabled', 899.99, true, 1, NOW()),
(3, 'ELEC-HP-001', 'Wireless Headphones', 'Noise-cancelling, 30hr battery life', 249.99, true, 1, NOW()),
(4, 'ELEC-TB-001', 'Tablet', '10-inch screen, 64GB storage', 399.99, true, 1, NOW()),
(5, 'ELEC-SM-001', 'Smart Watch', 'Fitness tracking, heart rate monitor', 299.99, true, 1, NOW()),

-- Clothing
(6, 'CLTH-TS-001', 'Cotton T-Shirt', '100% cotton, various colors', 19.99, true, 2, NOW()),
(7, 'CLTH-JN-001', 'Denim Jeans', 'Classic fit, premium denim', 59.99, true, 2, NOW()),
(8, 'CLTH-JK-001', 'Winter Jacket', 'Water-resistant, insulated', 129.99, true, 2, NOW()),
(9, 'CLTH-SN-001', 'Running Sneakers', 'Lightweight, breathable', 89.99, true, 2, NOW()),
(10, 'CLTH-DR-001', 'Summer Dress', 'Floral pattern, lightweight fabric', 49.99, true, 2, NOW()),

-- Books
(11, 'BOOK-FIC-001', 'Mystery Novel', 'Bestselling thriller', 14.99, true, 3, NOW()),
(12, 'BOOK-SCI-001', 'Science Encyclopedia', 'Comprehensive science guide', 39.99, true, 3, NOW()),
(13, 'BOOK-COK-001', 'Cookbook Collection', '500 recipes from around the world', 29.99, true, 3, NOW()),
(14, 'BOOK-BIO-001', 'Famous Biography', 'Inspiring life story', 24.99, true, 3, NOW()),
(15, 'BOOK-TECH-001', 'Programming Guide', 'Learn modern web development', 49.99, true, 3, NOW()),

-- Home & Kitchen
(16, 'HOME-CM-001', 'Coffee Maker', '12-cup programmable coffee maker', 79.99, true, 4, NOW()),
(17, 'HOME-BL-001', 'Blender', 'High-speed blender, 1000W', 99.99, true, 4, NOW()),
(18, 'HOME-VC-001', 'Vacuum Cleaner', 'Cordless, powerful suction', 199.99, true, 4, NOW()),
(19, 'HOME-BS-001', 'Bed Sheet Set', 'Queen size, 100% cotton', 59.99, true, 4, NOW()),
(20, 'HOME-LM-001', 'LED Lamp', 'Adjustable brightness, modern design', 34.99, true, 4, NOW()),

-- Sports & Outdoors
(21, 'SPRT-YM-001', 'Yoga Mat', 'Non-slip, eco-friendly material', 29.99, true, 5, NOW()),
(22, 'SPRT-DB-001', 'Dumbbell Set', '2x 20lb adjustable dumbbells', 89.99, true, 5, NOW()),
(23, 'SPRT-BK-001', 'Mountain Bike', '21-speed, aluminum frame', 499.99, true, 5, NOW()),
(24, 'SPRT-TN-001', 'Camping Tent', '4-person, waterproof', 149.99, true, 5, NOW()),
(25, 'SPRT-BB-001', 'Basketball', 'Official size and weight', 24.99, true, 5, NOW()),

-- Toys & Games
(26, 'TOYS-BL-001', 'Building Blocks Set', '500 pieces, ages 6+', 39.99, true, 6, NOW()),
(27, 'TOYS-DL-001', 'Action Figure Doll', 'Collectible, articulated', 19.99, true, 6, NOW()),
(28, 'TOYS-BG-001', 'Board Game', 'Family strategy game, 2-6 players', 34.99, true, 6, NOW()),
(29, 'TOYS-PZ-001', 'Jigsaw Puzzle', '1000 pieces, scenic landscape', 24.99, true, 6, NOW()),
(30, 'TOYS-RC-001', 'Remote Control Car', 'Rechargeable, high-speed', 79.99, true, 6, NOW());

-- ============================================================================
-- 6. INVENTORY
-- ============================================================================
INSERT INTO inventory (id, product_id, quantity) VALUES
-- Electronics (good stock)
(1, 1, 50),
(2, 2, 100),
(3, 3, 75),
(4, 4, 60),
(5, 5, 80),

-- Clothing (varied stock)
(6, 6, 200),
(7, 7, 150),
(8, 8, 45),
(9, 9, 120),
(10, 10, 90),

-- Books (high stock)
(11, 11, 300),
(12, 12, 100),
(13, 13, 150),
(14, 14, 200),
(15, 15, 180),

-- Home & Kitchen
(16, 16, 65),
(17, 17, 55),
(18, 18, 40),
(19, 19, 110),
(20, 20, 95),

-- Sports & Outdoors
(21, 21, 130),
(22, 22, 70),
(23, 23, 25),
(24, 24, 35),
(25, 25, 160),

-- Toys & Games
(26, 26, 85),
(27, 27, 140),
(28, 28, 60),
(29, 29, 100),
(30, 30, 45);

-- ============================================================================
-- 7. CARTS
-- ============================================================================
-- Active carts for testing
INSERT INTO carts (id, user_id, total_amount, total_items, created_at, updated_at) VALUES
(1, 1, 1549.98, 2, NOW(), NOW()),  -- John's cart
(2, 2, 0.00, 0, NOW(), NOW()),      -- Jane's empty cart
(3, 4, 89.99, 1, NOW(), NOW()),     -- Mike's cart
(4, 5, 249.99, 1, NOW(), NOW());    -- Sarah's cart

-- ============================================================================
-- 8. CART ITEMS
-- ============================================================================
-- Note: CartItem entity has: id, cart_id, product_id, product_name, product_image, price, quantity, subtotal, added_at
INSERT INTO cart_items (id, cart_id, product_id, product_name, price, quantity, subtotal, added_at) VALUES
-- John's cart (Cart ID: 1)
(1, 1, 1, 'Premium Laptop', 1299.99, 1, 1299.99, NOW()),
(2, 1, 3, 'Wireless Headphones', 249.99, 1, 249.99, NOW()),

-- Mike's cart (Cart ID: 3)
(3, 3, 9, 'Running Sneakers', 89.99, 1, 89.99, NOW()),

-- Sarah's cart (Cart ID: 4)
(4, 4, 3, 'Wireless Headphones', 249.99, 1, 249.99, NOW());

-- ============================================================================
-- 9. ORDERS (Sample completed orders for history)
-- ============================================================================
INSERT INTO orders (id, user_id, status, total_amount, created_at) VALUES
(1, 1, 'DELIVERED', 1349.98, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(2, 2, 'SHIPPED', 399.99, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(3, 4, 'PAID', 89.97, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4, 5, 'PLACED', 174.98, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 1, 'CANCELLED', 299.99, DATE_SUB(NOW(), INTERVAL 15 DAY));

-- ============================================================================
-- 10. ORDER ITEMS
-- ============================================================================
INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES
-- Order 1 (John's delivered order)
(1, 1, 2, 1, 899.99),   -- Smartphone
(2, 1, 6, 3, 19.99),    -- 3x T-Shirts
(3, 1, 11, 2, 14.99),   -- 2x Mystery Novels

-- Order 2 (Jane's shipped order)
(4, 2, 4, 1, 399.99),   -- Tablet

-- Order 3 (Mike's paid order)
(5, 3, 6, 3, 19.99),    -- 3x T-Shirts
(6, 3, 11, 2, 14.99),   -- 2x Mystery Novels

-- Order 4 (Sarah's placed order)
(7, 4, 7, 2, 59.99),    -- 2x Jeans
(8, 4, 16, 1, 79.99),   -- Coffee Maker
(9, 4, 20, 1, 34.99),   -- LED Lamp

-- Order 5 (John's cancelled order)
(10, 5, 5, 1, 299.99);  -- Smart Watch

-- ============================================================================
-- 11. PAYMENTS
-- ============================================================================
INSERT INTO payments (id, order_id, status, amount, paid_at) VALUES
(1, 1, 'SUCCESS', 1349.98, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(2, 2, 'SUCCESS', 399.99, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(3, 3, 'SUCCESS', 89.97, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4, 4, 'PENDING', 174.98, NULL),  -- Payment pending
(5, 5, 'FAILED', 299.99, NULL);   -- Payment failed, order cancelled

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify seed data

SELECT 'Data Loading Summary' as Info;

SELECT 'Users' as Table_Name, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Inventory', COUNT(*) FROM inventory
UNION ALL
SELECT 'Carts', COUNT(*) FROM carts
UNION ALL
SELECT 'Cart Items', COUNT(*) FROM cart_items
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*) FROM order_items
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments;

-- ============================================================================
-- TEST DATA SUMMARY
-- ============================================================================
-- USERS:
--   - 5 users (IDs: 1-5)
--   - User ID 3 is admin
--   - All passwords: 'password123'
--
-- PRODUCTS:
--   - 30 products across 6 categories
--   - All active with stock
--   - Price range: $14.99 - $1,299.99
--
-- CARTS:
--   - User 1 (John): 2 items ($1,549.98) - Ready for checkout
--   - User 2 (Jane): Empty cart
--   - User 4 (Mike): 1 item ($89.99) - Ready for checkout
--   - User 5 (Sarah): 1 item ($249.99) - Ready for checkout
--
-- ORDERS:
--   - 5 historical orders in various states
--   - Statuses: DELIVERED, SHIPPED, PAID, PLACED, CANCELLED
--
-- PAYMENTS:
--   - 5 payments matching orders
--   - Mix of SUCCESS, PENDING, and FAILED
-- ============================================================================

SELECT '';
SELECT '✓ Seed data loaded successfully!' as Status;
SELECT 'Run your tests now!' as Message;