// app只做路由功能

const express = require('express');
const path = require('path');
const session = require('express-session');     // 保存帳號訊息


// 引入模塊
const admin = require('./routes/admin');
const index = require('./routes/index');

// 實例化express
const app = new express();


// 配置中間件，固定格式
app.use(session({
	secret: '0000',
	resave: false,
	saveUninitialized: true,
	cookie: {maxAge: 1000 * 60 * 30},   // cookie保存30分鐘
	rolling: true   // 最後一次操作後可以再保存30分鐘的cookie
}));

app.use('/upload', express.static(path.join(__dirname, 'upload')));



// 使用ejs模板引擎，安裝完成後不需要import可以直接使用
// 默認找views這個目錄
app.set('view engine', 'ejs');


// 配置public目錄為靜態資源目錄
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/admin', admin);

app.listen(3000, () => console.log(`app is running at port 3000`));

