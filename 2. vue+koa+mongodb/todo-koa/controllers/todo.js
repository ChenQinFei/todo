/**
 * @description todo 增删改查
 */

const Todo_col = require('./../models/todo');
const uuidv1 = require('uuid/v1')

var fn_find = async (ctx, next) => {

    console.log("查找 todo");
    
    ctx.status = 200;
    const userId = ctx.session.userId ;
    if (!userId) {
        ctx.body = {
            code: 0,
            msg: "用户未登录或登录过期！"
        }
        return;
    }

    const todos = await Todo_col.find({
        userId,
    });

    ctx.body = {
        code: 1,
        msg: "查找成功",
        data: todos || [],
    };

};

var fn_add = async (ctx, next) => {
    console.log("添加 todo");

    // todo: session 用户信息
    const userId = ctx.session.userId;
    ctx.status = 200;
    if (!userId) {
        ctx.body = {
            code: 0,
            msg: "用户未登录或登录过期！"
        }
        return;
    }

    const req = ctx.request.body;
    const todoId = uuidv1();
    const newTodo = await Todo_col.create({
        todoId: todoId,
        userId: userId,
        content: req.content,
    });

    if (newTodo) {
        ctx.body = {
            code: 1,
            msg: '添加成功！',
            data: {
                todoId: newTodo.todoId,
            }
        }
    }
};

var fn_delete = async (ctx, next) => {
    console.log("删除 todo");
    ctx.status = 200;
    // todo: session 用户信息
    const userId = ctx.session.userId;
    if (!userId) {
        ctx.body = {
            code: 0,
            msg: "用户未登录或登录过期！"
        }
        return;
    }

    const req = ctx.request.body;
    const result = await Todo_col.deleteMany({
        todoId: {$in: req.todoIds}
    });
    if (result) {
        ctx.body = {
            code: 1,
            msg: '删除成功！',
        }
    } else {
        ctx.body = {
            code: 0,
            msg: '删除失败！',
        }
    }
};

var fn_update = async (ctx, next) => {
    console.log('更新 todo');
    ctx.status = 200;
    // todo: session 用户信息
    const userId = ctx.session.userId;
    if (!userId) {
        ctx.body = {
            code: 0,
            msg: "用户未登录或登录过期！"
        }
        return;
    }

    const req = ctx.request.body;
    const result = await Todo_col.updateOne({
        todoId: req.todoId,
    }, req);

    if (result.nModified == 1) {
        ctx.body = {
            code: 1,
            msg: '更新成功！',
        }
    } else {
        ctx.body = {
            code: 0,
            msg: '更新失败！',
        }
    }
};

module.exports = {
    'GET /find': fn_find,
    'POST /add': fn_add,
    'POST /delete': fn_delete,
    'POST /update': fn_update
}