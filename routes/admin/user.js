const express = require('express');
// 可以使用 express.Router()，創建模塊化、可掛載的路由句柄
const router = express.Router();
const md5 = require('md5');     // md5加密
const multiparty = require('multiparty');


const DB = require('../../modules/db');


router.get('/', (req, res) => {
	DB.find('user', {}, (err, data) => {
		res.render('admin/user/index', {
			list: data
		});
	});
});

router.get('/add', (req, res) => {
	res.render('admin/user/add');
});

// 處理商品的業務邏輯
router.post('/doAdd', (req, res) => {
// 實例化multiparty
	const form = new multiparty.Form();

	form.parse(req, (err, fields, files) => {
		// 獲取提交的數據以及圖片上傳成功返回的圖片信息

		const username = fields.username[0];
		const password = md5(fields.password)[0];    // 要對輸入密碼進行加密


		// 把新增的資料保存到數據庫裡面
		DB.insert('user', {
			username,
			password,
		}, (err, data) => {
			if (!err) {
				// 上傳成功跳轉到首頁
				res.redirect('/admin/user');
			}
		});

	});
});



router.get('/delete', (req, res) => {
	// 獲取id
	const id = req.query.id;

	DB.deleteOne('user',
		{'_id': new DB.ObjectID(id)},
		(err) => {
			if (!err) {     // 刪除成功
				res.redirect('/admin/user');
			}
		});
});

// 模塊化：需要暴露router模塊
module.exports = router;
