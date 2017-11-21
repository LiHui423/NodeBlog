/*
 * https://github.com/thu/Nodejs_1707
 *
 * Copyright mingfei.net@gmail.com
 * Released under the MIT license
 *
 * Date: 2017/11/19 10:16
 */

const express = require('express'); // 引入 express 模块
const bodyParser = require('body-parser'); // 引入 body-parser 模块
const mysql = require('mysql');

let pool = mysql.createPool({
    connectionLimit: 10,
    user: 'root'
});

let app = express(); // 创建 express 对象

app.use(bodyParser.urlencoded({extended:false})); // 配置 body-parser 中间件，注意位置
app.use(express.static(__dirname)); // 配置了静态目录 public

app.get('/', (req, res) => { // 接受服务器的根目录 GET 请求
    console.log('test...'); // 控制台输出信息
    // res.end('end...'); // res:response end 方法在网页上输出字符串，同时结束了这次响应
    res.sendFile(__dirname + '/register.html'); // 页面跳转
});

app.post('/signUp', (req, res) => { // 接受用户注册请求
    let username = req.body.username;
    let password = req.body.password;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        let sql = 'SELECT * FROM db_demo.user WHERE username = ?';
        connection.query(sql, [username], (err, results, fields) => {
            if (err) throw err;
            if (results.length === 1) {
                res.sendFile(__dirname + '/register.html');
            } else {
                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    let sql = 'INSERT INTO db_demo.user VALUE(NULL, ?, ?)';
                    connection.query(sql, [username, password], (err, results, fields) => {
                        if (err) throw err;
                        if (results.affectedRows === 1) { // 注册成功
                            console.log("注册成功");
                            res.sendFile(__dirname + '/login.html');
                        } else { // 注册失败
                            console.log("注册失败");
                            res.sendFile(__dirname + '/register.html');
                        }
                    });
                    connection.release();
                })
            }
        })
    });
});

app.post('/signIn', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(`${username},${password}`);

    pool.getConnection((err, connection) => {
        if (err) throw err;
        let sql = 'SELECT * FROM db_demo.user WHERE username = ? AND password = ?'; // Alt + Shift + U
        connection.query(sql, [username, password], (err, results, fields) => {
            if (err) throw err;
            let jsonData = {"status": "ERR"};
            if (results.length === 1) {
                jsonData = {"status": "OK"};
            }
            res.send(jsonData);
        });
        connection.release();
    })
});

app.listen(80); // 监听 80 端口，80 是 http 协议的默认端口