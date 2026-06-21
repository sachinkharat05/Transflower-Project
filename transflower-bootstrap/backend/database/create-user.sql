CREATE DATABASE IF NOT EXISTS transflower;

DROP USER IF EXISTS 'transflower_user'@'localhost';
DROP USER IF EXISTS 'transflower_user'@'127.0.0.1';

CREATE USER 'transflower_user'@'localhost' IDENTIFIED BY 'transflower123';
CREATE USER 'transflower_user'@'127.0.0.1' IDENTIFIED BY 'transflower123';

GRANT ALL PRIVILEGES ON transflower.* TO 'transflower_user'@'localhost';
GRANT ALL PRIVILEGES ON transflower.* TO 'transflower_user'@'127.0.0.1';
FLUSH PRIVILEGES;
