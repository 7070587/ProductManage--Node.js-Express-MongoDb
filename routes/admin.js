const express = require('express');
// 可以使用 express.Router()，創建模塊化、可掛載的路由句柄
const router = express.Router();

// 後台的路由，所有的後台處理都要經過這裡
const login = require('./admin/login');
const product = require('./admin/product');
const user = require('./admin/user');


// 自定義中間件，判斷登入狀態
router.use((req, res, next) => {
	console.log(req.url);
	if (req.url === '/login' || req.url === '/login/doLogin') {
		next();
	} else {
		// 判斷是否登入，如果有登入，userinfo會存在session裡面
		if (req.session.userinfo && req.session.userinfo.username !== '') {
			// 登入成功
			// ejs中，設置全局數據，所有的頁面都可以使用
			// app.locals['userinfo'] = xxx;
			// req.app.locals 請求的全局
			req.app.locals['userinfo'] = req.session.userinfo;  // 配置全局變量，可以在任何模板中使用
			next();
		} else {
			res.redirect('/admin/login');     // 沒有登入，跳轉到/login頁面
		}
	}

});


// 配置路由
// admin/login
router.use('/login', login);
router.use('/product', product);
router.use('/user', user);

// 模塊化：需要暴露router模塊
module.exports = router;



// router.get('/', (req, res) => {
// 	res.send('admin index');
// });
//
//
// router.get('/user', (req, res) => {
// 	res.send('admin user');
// });
//
//
// router.get('/product', (req, res) => {
// 	res.send('admin product');
// });
