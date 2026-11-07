<?php
/**
 * Hostinger MySQL Database Configuration
 * Update these credentials with your details from Hostinger hPanel -> Databases -> MySQL Databases
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'u123456789_lumina');     // Your Hostinger database name
define('DB_USER', 'u123456789_admin');      // Your Hostinger database username
define('DB_PASS', 'YOUR_STRONG_PASSWORD');  // Your Hostinger database password

function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }
}
