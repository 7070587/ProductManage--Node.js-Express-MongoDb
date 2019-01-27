const express = require('express');
// 可以使用 express.Router()，創建模塊化、可掛載的路由句柄
const router = express.Router();

const DB = require('../modules/db');

router.get('/', (req, res) => {
	// res.send('login');
	res.render('admin/login');
});


router.get('/product', (req, res) => {
	res.render('admin/login');
});

module.exports = router;
