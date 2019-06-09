# todo-koa
## Project setup
```
npm install
```

## Run koa
```
npm start
```

## 源码目录介绍
```
├── controllers               // 各控制器目录
│   ├── login.js              // 登录控制器
│   └── todo.js               // todo 增删查改控制器
│── models                    // 表目录
│   ├── password.js           // 密码表 
│   ├── todo.js               // todo表
│   └── user.js               // 用户表
├── utils                     // 工具库
│   └── passport.js           // 用户密码加密和验证工具
├── app.js                    // 项目入口
├── config.js                 // 基础配置信息
└── controllers               // 控制器添加中间件
```

## Cors Settings
> in file `app.js`
> 
> 当前配置支持本地8080端口

```
const cors = require('koa2-cors');
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));
```

## MongoDb Settings
> in file `config.js`
> 
> 当前配置使用MongoDB默认端口27017

```
db: 'mongodb://localhost:27017/to-dos', // 数据库
```
