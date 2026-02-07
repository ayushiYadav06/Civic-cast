<?php
// Load .env if present (so CLI scripts can connect using same credentials)
if (file_exists(__DIR__ . '/../.env')) {
	$lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
	foreach ($lines as $line) {
		$line = trim($line);
		if (empty($line) || strpos($line, '#') === 0) continue;
		if (strpos($line, '=') === false) continue;
		list($name, $value) = explode('=', $line, 2);
		$name = trim($name);
		$value = trim($value);
		if (!empty($name)) {
			putenv(sprintf('%s=%s', $name, $value));
			$_ENV[$name] = $value;
		}
	}
}

require_once __DIR__ . '/../utils/Database.php';

use App\Utils\Database;

$db = Database::getInstance()->getConnection();

$stmt = $db->query("SELECT COUNT(*) as cnt FROM categories");
$catCount = $stmt->fetch()['cnt'] ?? 0;

$stmt = $db->query("SELECT COUNT(*) as cnt FROM sub_categories");
$subCount = $stmt->fetch()['cnt'] ?? 0;

echo "Categories: $catCount\n";
echo "Sub-categories: $subCount\n";
