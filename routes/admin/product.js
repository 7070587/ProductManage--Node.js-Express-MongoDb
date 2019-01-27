const express = require('express');
const router = express.Router();
// 圖片上傳模塊，可以獲取form表單的數據，也可以實現上傳圖片
const multiparty = require('multiparty');
const fs = require('fs');

const DB = require('../../modules/db');


router.get('/', (req, res) => {
	DB.find('product', {}, (err, data) => {
		res.render('admin/product/index', {
			list: data
		});
	});
});


// 處理商品的業務邏輯

router.get('/add', (req, res) => {
	res.render('admin/product/add');
});

/*
// 圖片上傳使用：multiparty
const form = new multiparty.Form();
form.uploadDir = 'upload';  // 上傳圖片保存的地址
form.parse(req, function(err, fields, files) {
	// 獲取提交的數據以及圖片上傳成功返回的圖片信息
});
// 在html頁面的form表單要加入 enctype="multipart/form-data" method="post"
*/
// 獲取表單提交的數據，以及post過來的圖片
router.post('/doAdd', (req, res) => {
// 實例化multiparty
	const form = new multiparty.Form();

	// 上傳圖片保存的地址，目錄必須存在才可以上傳
	form.uploadDir = 'upload';

	// fields：獲取表單的數據；files圖片上傳成功返回的地址信息
	form.parse(req, (err, fields, files) => {
		// 獲取提交的數據以及圖片上傳成功返回的圖片信息
		// console.log(fields);
		// console.log(files);
		const title = fields.title[0];
		const price = fields.price[0];
		const fee = fields.fee[0];
		const description = fields.description[0];
		const pic = files.pic[0].path;
		// console.log(pic);

		// 把新增的資料保存到數據庫裡面
		DB.insert('product', {
			title,
			price,
			fee,
			description,
			pic,
		}, (err, data) => {
			if (!err) {
				// 上傳成功跳轉到首頁
				res.redirect('/admin/product');
			}
		});

	});
});


router.get('/edit', (req, res) => {
// 獲取get傳值，id
	const id = req.query.id;
	// console.log(id);

	// 去數據庫查詢這個id對應的數據，自增長的id要用 {"_id": new DB.ObjectID(id)} 來匹配
	DB.find('product', {"_id": new DB.ObjectID(id)}, (err, data) => {
		console.log(data);
		// 渲染靜態頁面
		res.render('admin/product/edit', {
			list: data[0]
		});
	});
});


// 執行修改商品的路由
router.post('/doEdit', (req, res) => {
	const form = new multiparty.Form();

	// 上傳圖片保存的地址
	form.uploadDir = 'upload';

	// 獲取提交的數據以及圖片上傳成功返回的圖片信息
	form.parse(req, (err, fields, files) => {
		// console.log(fields);
		// console.log(files);
		const _id = fields._id[0];  //以_id作為修改的條件
		const title = fields.title[0];
		const price = fields.price[0];
		const fee = fields.fee[0];
		const description = fields.description[0];

		// 判斷圖片是否有修改，沒有修改圖片 --> originalFilename: '',
		const originalFilename = files.pic[0].originalFilename;
		const pic = files.pic[0].path;

		if (originalFilename) {     // 修改圖片
			var setData = {
				title,
				price,
				fee,
				description,
				pic,
			};
		} else {    // 沒有修改圖片
			var setData = {
				title,
				price,
				fee,
				description,
			};
			// 刪除生成的臨時文件
			fs.unlink(pic, () => {});
		}

		// 把修改的資料保存到數據庫裡面
		DB.update('product',
			{"_id": new DB.ObjectID(_id)}, setData,
			(err, data) => {
				if (!err) {     // 修改成功
					res.redirect('/admin/product');
				}
			});
	});
});


router.get('/delete', (req, res) => {
	// 獲取id
	const id = req.query.id;

	DB.deleteOne('product',
		{'_id': new DB.ObjectID(id)},
		(err) => {
			if (!err) {     // 刪除成功
				res.redirect('/admin/product');
			}
		});
});


// 模塊化：需要暴露router模塊
module.exports = router;
