const fs = require('fs');

/*
* router 添加 url-route
*/
function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

/*
* 扫描 controllers 文件夹，处理每个js文件
*/
function addControllers(router, dir) {
    dir = __dirname + '/' + dir
    var files = fs.readdirSync(dir);
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(dir + '/' + f);
        addMapping(router, mapping);
    }
}

module.exports = (dir) => {
    let 
        controllers_dir = dir || 'controllers',
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};