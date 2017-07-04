// express_demo.js 文件
var fs = require('fs')

// 引入 express 并且创建一个 express 实例赋值给 app
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

var log = console.log.bind(console, '---log: ')

var todoList = []

// 配置静态文件目录
app.use(express.static('static_files'))
// 把前端发过来的数据自动用 json 解析的套路
app.use(bodyParser.json())

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var sendHtml = function(path, response) {
    var options = {
        encoding: 'utf-8'
    }
    fs.readFile(path, options, function(err, data){
        response.send(data)
    })
}

var sendJSON = function(response, data) {
    var r = JSON.stringify(data, null, 2)
    response.send(r)
}

app.get('/', function(request, response) {
    var path = 'index.html'
    sendHtml(path, response)
})

app.get('/todo/all', function(request, response) {
    sendJSON(response, todoList)
})

var todoAdd = function(form) {
    if (todoList.length == 0) {
        form.id = 1
    } else {
        var lastTodo = todoList[todoList.length-1]
        form.id = lastTodo.id + 1
    }
    form.time = new Date().Format("MM-dd hh:mm")
    todoList.push(form)
    return form
}

var todoDelete = function(id) {
    id = Number(id)
    var index = -1
    for (var i = 0; i < todoList.length; i++) {
        var t = todoList[i]
        if (t.id == id) {
            index = i
            break
        }
    }

    if (index > -1) {
        var t = todoList.splice(index, 1)[0]
        return t
    } else {
        return {}
    }
}

var todoComplete = function(id) {
    id = Number(id)
    var index = -1
    for (var i = 0; i < todoList.length; i++) {
        var t = todoList[i]
        if (t.id == id) {
            index = i
            break
        }
    }

    if (index > -1) {
        var t = todoList[index]
        t.complete = true
        return t
    } else {
        return {}
    }
}

app.post('/todo/add', function(request, response) {
    var form = request.body
    var todo = todoAdd(form)
    sendJSON(response, todo)
})

app.get('/todo/delete/:id', function(request, response) {
    var id = request.params.id
    var todo = todoDelete(id)
    sendJSON(response, todo)
})

app.get('/todo/complete/:id', function(request, response) {
    var id = request.params.id
    var todo = todoComplete(id)
    sendJSON(response, todo)
})

var server = app.listen(8081, function () {
    console.log('server', arguments.length, arguments)
    var host = server.address().address
    var port = server.address().port

    console.log(`应用实例，访问地址为 http://${host}:${port}`)
})
