-- Cleanup test data for Finn Registry
-- Run with: npx wrangler d1 execute finn-db --local --file=./cleanup.sql

-- Delete test versions first (due to foreign keys)
DELETE FROM versions WHERE package_name IN ('test_pkg', 'http_server', 'math_utils');

-- Delete download stats
DELETE FROM download_stats WHERE package_name IN ('test_pkg', 'http_server', 'math_utils');

-- Delete packages
DELETE FROM packages WHERE name IN ('test_pkg', 'http_server', 'math_utils');

-- Delete test users
DELETE FROM users WHERE github_id IN (12345, 67890);