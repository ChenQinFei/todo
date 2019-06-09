<template>
    <div class="apps" id="apps">
        <section  class="todoapp">
            <header class="header">
                <!-- <h1>{{ date.getHours() }} : {{date.getMinutes()}}</h1> -->
                <h1> {{date.format("hh : mm")}}</h1>
                <h2>What needs to be done ?</h2>
                <input class="new-todo" type="text" v-model.trim="newtodo.content" @keydown="handleAdd($event)" placeholder="" :autofocus="'autofocus'"/>
            </header>
            <section v-if="todos.length > 0">
                <!-- <ul  class="todo-list"> -->
                <transition-group name="slide-fade" tag='ul' class="todo-list">
                    <li v-for="(todo, index) in showTodos" :key="todo.todoId" :class="todo.isCompleted ? 'completed' : ''">
                        <div class="view">
                            <i class="icon-checkbox" @click="toggle(index)"></i>
                            <label class="todo-content" @dblclick="handleEdit(index)">{{ todo.content }}</label>
                            <button class="destory" @click="destory(index)"></button>
                        </div>
                        <input class="edit" v-model.trim="todo.content" @keydown="editing($event, index)" @blur="edited(index)">
                    </li>
                </transition-group>
                <!-- </ul> -->
            </section>
            <footer v-if="todos.length > 0" class="footer">
                <span class="todo-count"><strong>{{ activeNumber }}</strong> {{ activeNumber > 1 ?  "items" : "item"}} left</span>
                <ul class="filters">
                    <li>
                        <a :class="currentSelected == 1? 'selected': ''" href="#/">All</a>
                    </li>
                    <li>
                        <a :class="currentSelected == 2? 'selected': ''" href="#/active">Active</a>
                    </li>
                    <li>
                        <a :class="currentSelected == 3? 'selected': ''" href="#/completed">Completed</a>
                    </li>
                </ul>
                <div class="clear-completed">
                    <transition name="slide-fade">
                        <button v-if="completedNumber > 0" @click="destoryAllCompleted">Clear completed</button>
                    </transition>
                </div>
            </footer>
        </section>
        <footer class="info">
            <p>Double-click to edit a todo</p>
            <p>Written by <a href="http://chenqinfei.top/">Jenny Chen</a></p>
        </footer>
    </div>
</template>

<script>
    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }

    const routes = {
        '#/': 1,
        '#/active': 2,
        '#/completed':3,
    };

    export default {
        name: "Todo",
        data: function(){
            return {
                date: new Date(),
                newtodo: {
                    content:"",
                    isCompleted: false,
                    todoId: 0,
                },
                todos:[],
                currentRoute: window.location.hash,
            }
        },
        computed: {
            completedNumber: function() {
                return this.todos.filter(function(cur){return cur.isCompleted == 1}).length;
            },
            activeNumber: function() {
                return this.todos.filter(function(cur){return cur.isCompleted == 0}).length;
            },
            currentSelected: function() {
                return routes[this.currentRoute] || 1;
            },
            showTodos: function() {
                switch(routes[this.currentRoute]) {
                case 1: return this.todos;
                case 2: return this.todos.filter(function(cur){return !cur.isCompleted});
                case 3: return this.todos.filter(function(cur){return cur.isCompleted});
                default: return this.todos;
                }
            }

        },
        // watch: {
        //     todos: function() {
        //         this.setData();
        //     }
        // },
        created: function() {
            this.todos = this.getData() || [];   //读取 todo 数据
        },
        mounted: function() {
            document.getElementById("loading").classList.remove("show");
            document.getElementById("apps").classList.add("show");
            var _this = this;   //声明一个变量指向Vue实例this，保证作用域一致
            this.timer = setInterval(function () {
                _this.date = new Date();    //修改数据date
            }, 1000*60);
            window.addEventListener('hashchange', () => {
                this.currentRoute = window.location.hash;
            })
        },
        beforeDestroyed: function(){
            if (this.timer){
                clearInterval(this.timer);  //在Vue实例销毁前，清除定时器
            }
        },
        methods: {
            handleAdd: function(e) {
                if (e.keyCode == 13 && this.newtodo.content.trim() !=="") {
                    //新增至数据库，并更新todoId
                    this.addData((data)=>{
                        this.newtodo.todoId = data.todoId;
                        this.todos.unshift(this.newtodo);
                        //初始化 newtodo
                        this.newtodo = {
                            content:"",
                            isCompleted: false,
                            todoId: 0,
                        };
                    });


                }
            },
            destory: function(index) {
                //删除当前todo
                this.deleteData([this.todos[index].todoId]);

                this.todos.splice(index, 1);
            },
            destoryAllCompleted: function() {
                //删除所有已完成todo
                const deletedTodoIds = this.todos.filter((cur) => cur.isCompleted).map((cur) => cur.todoId);
                this.deleteData(deletedTodoIds);

                this.todos = this.todos.filter(function(cur){
                    return !cur.isCompleted;
                })
            },
            handleEdit: function(index) {
                const ele = document.querySelectorAll(".todo-list li")[index];
                ele.classList.add('editing');
                ele.querySelector('input').focus();
            },
            editing: function(e, index) {
                if (e.keyCode == 13 && this.todos[index].content.trim() !=="") {
                    this.edited(index);
                }
            },
            edited: function(index) {
                document.querySelectorAll(".todo-list li")[index].classList.remove('editing');

                //完成编辑，更新数据
                this.updateData(index);
            },
            toggle: function(index) {
                this.todos[index].isCompleted = !this.todos[index].isCompleted;

                //更改状态，更新数据
                this.updateData(index);
            },
            /* 数据库操作 */
            getData: function() {
                /* 读取 todo 数据，采用localStorage */
                this.$axios.get('/find').then((res) => {
                    res = res.data;
                    if (res.code === 0) {
                        console.log(`${res.msg}`);
                        this.$router.push({ path: '/login' })
                    } else {
                        console.log('查找成功');
                       this.todos = res.data;
                    }
                });
            },
            addData: function(cb) {
                this.$axios.post('/add', {
                    'content': this.newtodo.content
                }).then((res) => {
                    res = res.data;
                    if (res.code == 1){
                        console.log('添加成功');
                        !!cb && cb(res.data);
                    } else {
                        this.$router.push({ path: '/login' })
                    }
                })
            },
            updateData: function(index) {
                //todo: 内容为更新时，不发起更新请求
                this.$axios.post('/update', {
                    'content': this.todos[index].content,
                    'todoId': this.todos[index].todoId,
                    "isCompleted": this.todos[index].isCompleted,
                }).then((res) => {
                    res = res.data;
                    if (res.code == 1){
                        console.log(res.msg);
                    } else {
                        // this.$router.push({ path: '/login' });
                    }
                })
            },
            deleteData: function(todoIds) {
                this.$axios.post('/delete', {
                    'todoIds': todoIds,
                }).then((res) => {
                    res = res.data;
                    if (res.code == 1) {
                        console.log(res.msg);
                    } else {
                        // this.$router.push({ path: '/login' });
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }

        }
    }
</script>
<style scoped lang="scss">
    a, a:link, a:active, a:visited {
        color: #fff;
    }
    .apps {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        z-index: 4;
        transition: opacity .3s ease;
        color: #fff;
    }
    .apps.show {
        opacity: 1;
    }
    .todoapp {
        width: 760px;
        margin: 150px auto 50px;
    }
    .header {
        text-align: center;
        user-select: none;
        margin-bottom: 10px;
    }
    .header h1{
        font-size: 6rem;
        font-weight: 500;
    }
    .header h2 {
        font-size: 2rem;
        font-weight: 300;
        margin: 10px;
    }
    .new-todo, .edit {
        border: 0;
        border-bottom: 2px solid #fff;
        padding: 4px 0;
        background-color: transparent;
        width: 100%;
        font-size: 24px;
        font-weight: 500;
        color: #fff;
        text-align: center;
        transition: border-color .2s ease;

    }
    .todo-list li {
        position: relative;
    }

    .todo-list li .icon-checkbox {
        position: absolute;
        top: 50%;
        left: 10px;
        margin-top: -10px;
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 5px;
        border: 2px solid #d9d9d9a6;
        color: #FFC107;
        text-align: center;
    }
    .todo-list li.completed .icon-checkbox,   .todo-list li:hover .icon-checkbox{
        border-color: #d9d9d9;
    }
    .todo-list li.completed .icon-checkbox:before {
        content: '';
        display: block;
        width: 10px;
        height: 10px;
        background-color: #607d8b;  /* #FFC107 */
        position: absolute;
        top: 5px;
        left:5px;
    }
    .todo-list li .todo-content {
        word-break: break-all;
        padding: 15px 50px 15px 60px;
        display: block;
        font-size: 24px;
        line-height: 1.2;
        background-color: rgba(255, 255, 255, 0.1);
        margin: 3px 0;
    }
    .todo-list li.completed .todo-content {
        color: #d9d9d9;
        text-decoration: line-through;
    }
    .todo-list li .destory {
        display: none;
        position: absolute;
        top: 50%;
        right: 10px;
        bottom: 0;
        width: 40px;
        height: 40px;
        margin-top: -20px;
        font-size: 30px;
        color: #9e9e9e;
        margin-bottom: 11px;
        transition: color 0.2s ease-out;
    }
    .todo-list li .destory::after {
        content: '×';
        display: block;
    }
    .todo-list li .destory:hover {
        color: #fff;
    }
    .todo-list li:hover .destory {
        display: block;
    }
    .todo-list li .edit {
        display: none;
    }

    /* editing status */
    .todo-list li.editing .view {
        display: none;
    }
    .todo-list li.editing .edit {
        display: block;
        width: 685px;
        padding: 12px 16px;
        margin: 0 0 0 43px;
        text-align: left;
    }

    .footer {
        margin-top: 10px;
        padding: 10px 15px;
        height: 20px;
        display: flex;
    }
    .footer span.todo-count {
        flex: 1;
    }
    .footer .filters {
        flex: 2;
        text-align: center
    }
    .footer .filters li {
        display: inline;
    }
    .footer .filters li a {
        margin: 3px;
        padding: 3px 7px;
        text-decoration: none;
        border: 1px solid transparent;
        border-radius: 3px;
        transition: all .3s ease;
    }
    .footer .filters li>a:hover {
        border-color: #fec267;
    }
    .footer .filters li>a.selected {
        border-color: #FF9800;
    }
    .footer .clear-completed {
        flex: 1;
        text-align: right;
    }
    footer.info {
        text-align: center;
        color: #9e9e9e;
    }
    footer.info a {
        color: #9e9e9e;
    }

    /* 过渡动画  fade */
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
    .fade-move {
        transition: transform 1s;
    }
    /* slide fade */
    .slide-fade-enter-active {
        transition: all .5s ease;
    }
    .slide-fade-leave-active {
        transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }
    .slide-fade-move {
        transform: all .5s;
    }
    /* scale-fade */
    .scale-fade-enter-active,  .scale-fade-leave-active{
        transition: all 1s ease;
    }
    .scale-fade-enter,  .scale-fade-leave-to {
        transform: scale(0);
        opacity: 0;
    }
    .scale-fade-move {
        transform: all 1s;
    }
</style>