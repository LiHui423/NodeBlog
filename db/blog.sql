DROP DATABASE IF EXISTS db_demo;
CREATE DATABASE db_demo;

DROP TABLE IF EXISTS db_demo.user;
CREATE TABLE db_demo.user (
  id       INT AUTO_INCREMENT PRIMARY KEY
  COMMENT 'PK ID',
  #表内注释
  username VARCHAR(255) NOT NULL
  COMMENT '用户名',
  password VARCHAR(255) NOT NULL
  COMMENT '密码'
)
  COMMENT '用户表';

SELECT *
FROM db_demo.user;

SHOW FULL COLUMNS FROM db_demo.user;
SHOW TABLE STATUS FROM db_demo;