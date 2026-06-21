CREATE DATABASE IF NOT EXISTS `transflower`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `transflower`;

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `registered_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `category` VARCHAR(80) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  CONSTRAINT `chk_products_price` CHECK (`price` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `carts` (
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `product_id`),
  KEY `idx_carts_product_id` (`product_id`),
  CONSTRAINT `chk_carts_quantity` CHECK (`quantity` > 0),
  CONSTRAINT `fk_carts_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_carts_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` VARCHAR(40) PRIMARY KEY,
  `user_id` INT NOT NULL,
  `total` DECIMAL(10, 2) NOT NULL,
  `address` TEXT NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `payment_method` VARCHAR(80) NOT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'Pending',
  `order_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_orders_user_id` (`user_id`),
  CONSTRAINT `chk_orders_total` CHECK (`total` >= 0),
  CONSTRAINT `fk_orders_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(40) NOT NULL,
  `product_id` INT NOT NULL,
  `product_name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `category` VARCHAR(80) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL,
  KEY `idx_order_items_order_id` (`order_id`),
  KEY `idx_order_items_product_id` (`product_id`),
  CONSTRAINT `chk_order_items_price` CHECK (`price` >= 0),
  CONSTRAINT `chk_order_items_quantity` CHECK (`quantity` > 0),
  CONSTRAINT `fk_order_items_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`) VALUES
  (1, 'John Doe', 'john@example.com', 'pass123', '9876543210'),
  (2, 'Jane Smith', 'jane@example.com', 'pass123', '9123456789')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `password` = VALUES(`password`),
  `phone` = VALUES(`phone`);

INSERT INTO `products` (`id`, `name`, `price`, `category`, `image`) VALUES
  (1, 'Red Roses', 499, 'Roses', 'image/red rose.jpg'),
  (2, 'Tulip Delight', 399, 'Tulips', 'image/tublips.jpg'),
  (3, 'Sunflower Joy', 299, 'Sunflowers', 'image/sun.jpg'),
  (4, 'Red Rose Bouquet', 799, 'Bouquets', 'image/Red Rose  Bouquets.jpg'),
  (5, 'Yellow Roses', 599, 'Roses', 'image/Yellow Roses.jpg'),
  (6, 'White Orchid Bouquet', 899, 'Orchids', 'image/white orchids bouquet.jpg'),
  (7, 'White Rose', 549, 'Roses', 'image/White Rose.jpg'),
  (8, 'Yellow Tulips Bouquet', 699, 'Tulips', 'image/Yellow Tulips  Bouquets.jpg'),
  (9, 'Purple Orchid Bouquet', 999, 'Orchids', 'image/Purple orchid bouquet.jpg')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `price` = VALUES(`price`),
  `category` = VALUES(`category`),
  `image` = VALUES(`image`);
