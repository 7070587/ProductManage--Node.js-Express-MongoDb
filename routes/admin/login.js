const express = require('express');
const router = express.Router();    // 可以使用 express.Router()，創建模塊化、可掛載的路由句柄
const bodyParser = require('body-parser');
const md5 = require('md5');     // md5加密

const DB = require('../../modules/db');


// 設置body-parser中間鍵，獲取post
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({extended: false}));
// parse application/json
router.use(bodyParser.json());


router.get('/', (req, res) => {
	// res.send('login');
	res.render('admin/login');
});



// 獲取登入提交的數據、登入後跳轉頁面
router.post('/doLogin', (req, res) => {
// 用req.body獲取post提交的數據
//	console.log(req.body);   req.body --> { username: 'admin', password: '0000' }

	// 1.獲取數據
	const username = req.body.username;
	const password = md5(req.body.password);    // 要對輸入密碼進行加密

	// 2.連接數據庫，查詢數據庫是否有數據
	DB.find('user', {username, password}, (err, data) => {
		if (data.length > 0) {  // 登入成功
			// 保存帳號訊息，把對象保存到session裡面
			req.session.userinfo = data[0];

			// 登入成功跳轉到商品列表（商品管理後台）
			res.redirect('/admin/product');

		} else {
			res.send(`<script>alert('登入失敗'); location.href='/admin/login'</script>`);
		}

	});


});


// 登出
router.get('/logout', (req, res) => {
	// 清除session
	req.session.destroy(() => res.redirect('/admin/login'));

});

// 模塊化：需要暴露router模塊
module.exports = router;
