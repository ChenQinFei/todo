const session = require('koa-session');

const Koa = require('koa');
// 创建一个Koa对象表示web app本身:
const app = new Koa();

// config file
const config = require('./config');

const bodyParser = require('koa-bodyparser');

// https://www.npmjs.com/package/koa2-cors
const cors = require('koa2-cors');
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));


// mongoDB 
const mongoose = require('mongoose');
mongoose.connect(config.db, {useNewUrlParser:true}, (err) => {
    if (err) {
        console.log(err);
        console.error('Failed to connect to database');
    } else {
        console.log('Connecting database successfully');
    }
});

// session
app.keys = ['12345'];
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));


// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// parse request data 
app.use(bodyParser());

// url routers
const controller = require('./controller');
// url controller
app.use(controller());


// 在端口3000监听:
app.listen(config.port);
console.log(`app started at port ${config.port}...`);