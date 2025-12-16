-- Database: smart_canteen
CREATE DATABASE IF NOT EXISTS smart_canteen;
USE smart_canteen;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('student', 'employee', 'admin') NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(20) NULL,
    employee_id VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_username (username)
);

-- Menu items table
CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_available (is_available)
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_user (user_id),
    INDEX idx_order_date (order_date)
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    INDEX idx_order (order_id)
);

-- Stock table
CREATE TABLE stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    current_stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 10,
    unit VARCHAR(20),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_low_stock (current_stock, min_stock)
);

-- Activity log table
CREATE TABLE activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
);

-- Insert sample data
INSERT INTO users (username, password, email, role, full_name, student_id) VALUES
('student123', 'hashed_password', 'student@college.edu', 'student', 'John Student', 'S12345'),
('employee001', 'hashed_password', 'employee@canteen.edu', 'employee', 'Rajesh Kumar', 'EMP001'),
('admin', 'hashed_password', 'admin@canteen.edu', 'admin', 'Admin User', NULL);

INSERT INTO menu_items (name, description, price, category) VALUES
('Veg Burger', 'Delicious veg patty burger with fresh vegetables', 80.00, 'Main Course'),
('Margherita Pizza', 'Classic pizza with tomato sauce and cheese', 120.00, 'Main Course'),
('Coffee', 'Hot brewed coffee', 40.00, 'Beverages'),
('Sandwich', 'Grilled sandwich with veggies and cheese', 60.00, 'Snacks');

INSERT INTO stock (item_name, category, current_stock, min_stock, unit) VALUES
('Veg Burger Buns', 'Bakery', 42, 30, 'pieces'),
('Pizza Cheese', 'Dairy', 15, 20, 'kg'),
('Coffee Beans', 'Beverages', 8, 15, 'kg'),
('Sandwich Bread', 'Bakery', 35, 25, 'loaves');