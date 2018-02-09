var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/unionLotto');
var db = mongoose.connection;
var updateTimeSchema = null;
var updateTimeModel = null;
var unionLottoSchema = null;
var unionLottoModel = null;
// 连接成功
db.on('connected', () => {
    console.log('mongoose connected !');
    unionLottoSchema = new mongoose.Schema({
        periods: {
            type: Number,
            unique: true
        },
        prize_pool: Number,  //奖池
        bet_total: Number,  //投注金额
        red_num_1: Number,
        red_num_2: Number,
        red_num_3: Number,
        red_num_4: Number,
        red_num_5: Number,
        red_num_6: Number,
        blue_num: Number,
        date: Date,
    },
        { collection: "unionLotto" }
    );

    updateTimeSchema = new mongoose.Schema({
        date: {
            type: Date,
            unique: true
        },
    },
        { collection: "updateTime" }
    );

    unionLottoModel = mongoose.model('unionLottoModel', unionLottoSchema);
    updateTimeModel = mongoose.model('updateTimeModel', updateTimeSchema);
});

// 连接异常
db.on('error', (err) => {
    console.log('connection error: ' + err);
});


/**
 * 获取数据
 */
let getData = () => {

    var promise1 = new Promise(function (resolve, reject) {
        updateTimeModel.find({}, (err, value) => {
            if (err) reject(err);
            resolve(value);
        })
    });

    var promise2 = new Promise(function (resolve, reject) {
        unionLottoModel.find({},
            (err, value) => {
                if (err) reject(err);
                resolve(value);
            })
    });

    return Promise.all([promise1, promise2]);
}


/**
 * 导入数据库
 * @param {Array} arr  数据
 */
let importToDB = (obj) => {
    var t1 = new Date().valueOf()
    console.log('开始写入!');
    var arr = obj.result;
    var updateTime = obj.updateTime;

    new updateTimeModel({
        date: new Date(updateTime),
    }).save();

    for (let i = 0; i < arr.length; i++) {
        const v = arr[i];
        var model = new unionLottoModel({
            periods: v[0],
            bet_total: v[15],
            prize_pool: v[16],
            red_num_1: v[2],
            red_num_2: v[3],
            red_num_3: v[4],
            red_num_4: v[5],
            red_num_5: v[6],
            red_num_6: v[7],
            blue_num: v[8],
            date: new Date(v[1]),
        });

        model.save(function (err, doc) {
            if (i == arr.length - 1) {
                var t2 = new Date().valueOf();
                console.log('写入完成!', t2 - t1);
            }
        });
    }
}

module.exports = {
    importToDB,
    getData
}


