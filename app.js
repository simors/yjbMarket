/**
 * Created by wanpeng on 2017/8/8.
 */
'use strict';

var express = require('express');
var path = require('path');
var redEnvelope = require('./routers/redEnvelope')

var app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

//随机红包活动
app.use('/redEnvelope', redEnvelope)

var PORT = parseInt(3002);
app.listen(PORT, function (err) {
  console.log('market activity is running on port:', PORT);

  // 注册全局未捕获异常处理器
  process.on('uncaughtException', function(err) {
    console.error('Caught exception:', err.stack);
  });
  process.on('unhandledRejection', function(reason, p) {
    console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack);
  });
})