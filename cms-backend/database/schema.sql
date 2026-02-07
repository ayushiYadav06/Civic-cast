-- CMS Management System Database Schema
-- PHP 8 + MySQL

-- Drop tables if they exist (for clean installation)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `advertisements`;
DROP TABLE IF EXISTS `news_images`;
DROP TABLE IF EXISTS `news`;
DROP TABLE IF EXISTS `sub_categories`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `operators`;
DROP TABLE IF EXISTS `admins`;

SET FOREIGN_KEY_CHECKS = 1;

-- Admins table
CREATE TABLE `admins` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_username` (`username`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Operators table
CREATE TABLE `operators` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `login_id` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `area` VARCHAR(255) NOT NULL,
  `post` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(100) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_login_id` (`login_id`),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE `categories` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sub-categories table
CREATE TABLE `sub_categories` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT(11) UNSIGNED DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
  INDEX `idx_category_id` (`category_id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_is_active` (`is_active`),
  UNIQUE KEY `unique_category_slug` (`category_id`, `slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- News table
CREATE TABLE `news` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `operator_id` INT(11) UNSIGNED DEFAULT NULL,
  `sub_category_id` INT(11) UNSIGNED NULL,
  `title` VARCHAR(500) NOT NULL,
  `sub_title` VARCHAR(500) NULL,
  `content` TEXT NOT NULL,
  `slug` VARCHAR(500) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `views` INT(11) NOT NULL DEFAULT 0,
  `approved_by` INT(11) UNSIGNED NULL,
  `approved_at` TIMESTAMP NULL,
  `rejected_reason` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
    FOREIGN KEY (`operator_id`) REFERENCES `operators`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approved_by`) REFERENCES `admins`(`id`) ON DELETE SET NULL,
  INDEX `idx_operator_id` (`operator_id`),
  INDEX `idx_sub_category_id` (`sub_category_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- News images table
CREATE TABLE `news_images` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `news_id` INT(11) UNSIGNED NOT NULL,
  `image_path` VARCHAR(500) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `display_order` INT(11) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE CASCADE,
  INDEX `idx_news_id` (`news_id`),
  INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Advertisements table
CREATE TABLE `advertisements` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL,
  `image_path` VARCHAR(500) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `cropped_image_path` VARCHAR(500) NULL,
  `cropped_image_url` VARCHAR(500) NULL,
  `link_url` VARCHAR(500) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_is_active` (`is_active`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications table
CREATE TABLE `notifications` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `related_id` INT(11) UNSIGNED NULL,
  `related_type` VARCHAR(100) NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_type` (`type`),
  INDEX `idx_is_read` (`is_read`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin (password: admin123 - should be changed in production)
-- Password hash for 'admin123' using bcrypt
INSERT INTO `admins` (`username`, `email`, `password`, `name`) VALUES
('admin', 'admin@civiccast.com', '$2y$12$H74uX9e8uQGzXxmktQXNtu1pj.mt6I67iPn2jjCWMs5yAYQpurK.W', 'System Administrator');

