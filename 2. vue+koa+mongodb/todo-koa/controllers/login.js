/**
 * @description register, sign in and sign out.
 */

const config = require('./../config.js')
const passport = require('./../utils/passport')
const User_col = require('./../models/user')
const Passport_col = require('./../models/password')
const uuidv1 = require('uuid/v1')

var fn_index = async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="account" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
};


var fn_signin = async (ctx, next) => {
    const req = ctx.request.body;

    const user = await User_col.findOne({
        account: req.account
    }, {
        __v: 0,
        _id: 0
    });
    if(!user) {
        ctx.status = 200;
        ctx.body = {
            code: 0,
            msg: '用户名或密码错误！'
        }
        return;
    }

    const userId = user.userId;

    const pass = await Passport_col.findOne({
        userId
    }, {
        hash: 1,
    })

    const match = await passport.validate(req.password, pass.hash);

    ctx.status = 200;
    if (match) {
        // 加入session
        ctx.session.userId = user.userId;

        ctx.body = {
            code: 1, 
            msg: 'login success',
            data: {
                userId: user.userId,
                account: user.account
            }
        }
        return;
    }

    ctx.body = {
        code: 0,
        msg: '用户名或密码错误！'
    }
};

const fn_register = async (ctx, next) => {
    const req =  ctx.request.body;

    const user = await User_col.findOne({
        account: req.account
    })

    ctx.status = 200;
    if (user) {
        ctx.body = {
            code: 0,
            msg: '用户名重复！'
        }
        return
    }

    const userId = uuidv1();
    const newUser = await User_col.create({
        userId,
        account: req.account
    })

    if (newUser) {
        // 加密
        const hash = await passport.encrypt(req.password, config.saltTimes);
        const result = await Passport_col.create({
            userId: userId,
            hash
        })
        
        if (result) {
            // 加入session
            ctx.session.userId = newUser.userId;

            ctx.body = {
                code: 1,
                msg: '注册成功！',
                data: {
                    userId: newUser.userId,
                    account: newUser.account
                }
            }
        }
    }
}
var fn_signout = async (ctx, next) => {
    ctx.session = null;
    ctx.status = 200;
    ctx.body = {
        code: 1,
        msg: '登出成功！'
    }
}

module.exports = {
    'GET /': fn_index,
    'POST /signin': fn_signin,
    'GET /signout': fn_signout,
    'POST /register': fn_register,
}