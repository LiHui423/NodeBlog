const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');


let app=express();
app.use(bodyParser.urlencoded({
    extended:true  //请求的键值对，值可以是字符串
}));//调用此方法可以使用req.body.[表单中name属性值]取得表单中的参数


let pool=mysql.createPool({
    connectionLimit:10,
    user:'root'
});

app.get('/',(req,res) => {
    //res.send(__dirname.substring(0,34));
    res.sendFile(__dirname.substring(0,34)+'/login.html');
});
app.get('/sign-up',(req,res) => {
    //res.send(__dirname.substring(0,34));
    res.sendFile(__dirname.substring(0,34)+'/sign-up.html');
});

app.post('/signUp',(req,res) => {
    let username=req.body.username;//此username与html表单中name属性值对应
                    //body为请求主体部分
    let password=req.body.password;
    res.send(username+':'+password);

    pool.getConnection((err,connection) => {
        if (err) throw err;
        connection.query('INSERT INTO db_demo.user VALUE(null,?,?)',[username,password],(err,results,fields) => {
            console.log(results.affectedRows);
            if(results.affectedRows==1){

            }else{

            }
            connection.release();
        })
    })
});

app.post('/signIn',(req,res) => {
    let username=req.body.username;//此username与html表单中name属性值对应
    //body为请求主体部分
    let password=req.body.password;

    pool.getConnection((err,connection) => {
        if (err) throw err;
        connection.query('SELECT * FROM db_demo.user WHERE username=?   AND password=?',[username,password],(err,results,fields) => {
            console.log(results.length);
            if(results.length===1){

            }else{

            }
            connection.release();
        })
    })
});
app.listen(80);

//实现了请求根目录完成页面跳转的方式