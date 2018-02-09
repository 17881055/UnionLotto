//
// --- 配置的相关工具函数 ---
//
const path = require('path');
const fs = require('fs');

// 获取本地IP
exports.getIP = function() {
    const os = require('os');
    const ifaces = os.networkInterfaces();
    let ip = '';
    var result = [];
    for(let dev in ifaces) {
        ifaces[dev].forEach(function(details) {
            if( details.family === 'IPv4' && !details.internal) {
               // ip = details.address
                result.push(details.address);
            }
        })
    }
    return result;
}
