/*
操作數據庫的模塊，對連結mongodb進行封裝
 */
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// 數據庫操作
const dbUrl = 'mongodb://localhost:27017/productmanage';  // 連接數據庫

// 暴露ObjectID
exports.ObjectID = ObjectID;

connectDb = (callback) => {
	// 連接數據庫
	MongoClient.connect(dbUrl, (err, db) => {
		if (err) {  // 數據庫連接失敗
			return err;
		}

		// 增加

		// 刪除

		// 修改

		callback(db);

	});
};

// 查詢數據
/*
db.find('user', {查找條件}, (回調函數：err, data) => {
	data數據
})
 */
exports.find = (collection_name, find_data_conditions_json, callback) => {

	connectDb(db => {

		const result = db.collection(collection_name).find(find_data_conditions_json);

		// 遍歷拿到數據
		result.toArray((error, data) => {   // error：查詢數據的失敗回調
			// 關閉數據庫連接
			db.close();

			// 拿到數據 執行回調函數
			callback(error, data);
		});
	});
};


// 增加數據
/*
db.find('user', {查找條件}, (回調函數：err, data) => {
	data數據
})
 */
exports.insert = (collection_name, insert_data_conditions_json, callback) => {

	connectDb(db => {    // err：數據庫連接的失敗回調

		db.collection(collection_name).insertOne(insert_data_conditions_json, (error, data) => {
			callback(error, data);
		});
	});
};


// 修改數據
/*
db.find('user', 原數據, 修改後的數據, (回調函數：err, data) => {
	data數據
})
 */
exports.update = (collection_name, update_data_conditions_json, new_data_json, callback) => {  // update_data_conditions_json：原數據修改條件、new_data_json：修改後的數據

	connectDb(db => {

		db.collection(collection_name).updateOne(update_data_conditions_json, {$set: new_data_json}, (error, data) => {
				callback(error, data);
		});
	});
};


// 刪除數據
/*
db.find('user', {查找條件}, (回調函數：err, data) => {
	data數據
})
 */
exports.deleteOne = (collection_name, delete_data_conditions_json, callback) => {

	connectDb(db => {

		db.collection(collection_name).deleteOne(delete_data_conditions_json, (error, data) => {
			callback(error, data);
		});
	});
};
