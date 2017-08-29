前端原生js（仿jQuery写法），后端Nodejs

生成MySQL数据库的源代码：

```
CREATE TABLE `errorlog` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ctime` varchar(20) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `errorMessage` text,
  `ip` varchar(30) DEFAULT NULL,
  `useragent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=52 DEFAULT CHARSET=utf8 COMMENT='错误日志';

```