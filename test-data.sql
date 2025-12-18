-- Test data for Finn Registry
-- Run with: npx wrangler d1 execute finn-db --local --file=./test-data.sql

-- Insert test users
INSERT OR IGNORE INTO users (username, github_id, avatar_url, email, api_token) VALUES
('testuser1', 12345, 'https://github.com/images/error/testuser1_happy.gif', 'test1@example.com', 'finn_tok_test1'),
('testuser2', 67890, 'https://github.com/images/error/testuser2_happy.gif', 'test2@example.com', 'finn_tok_test2');

-- Insert test packages
INSERT OR IGNORE INTO packages (name, description, repo_url, keywords, license, owner_id) VALUES
('test_pkg', 'A test package for Finn Registry', 'https://github.com/test/test_pkg', '["test","example"]', 'MIT', 1),
('http_server', 'A lightweight HTTP server for Fin', 'https://github.com/test/http_server', '["http","server","web"]', 'MIT', 2),
('math_utils', 'Mathematical utilities library', 'https://github.com/test/math_utils', '["math","utils","calculations"]', 'Apache-2.0', 1);

-- Insert test versions
INSERT OR IGNORE INTO versions (package_name, version, commit_hash, changelog) VALUES
('test_pkg', '0.1.0', 'abc123def456', 'Initial release'),
('test_pkg', '0.2.0', 'def789ghi012', 'Added new features'),
('http_server', '1.0.0', 'jkl345mno678', 'Stable release'),
('math_utils', '0.1.0', 'pqr901stu234', 'Basic math functions');

-- Insert some download stats
INSERT OR IGNORE INTO download_stats (package_name, date, count) VALUES
('test_pkg', '2024-12-19', 5),
('http_server', '2024-12-19', 12),
('math_utils', '2024-12-19', 3);