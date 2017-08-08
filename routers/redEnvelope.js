/**
 * Created by wanpeng on 2017/8/8.
 */
'use strict';
var router = require('express').Router()
var GLOBAL_CONFIG = require('../config')
var wechat = require('../wechat')


router.get('/', function (req, res, next) {

  var domain = GLOBAL_CONFIG.SERVER_DOMAIN

  var auth_callback_url = domain + '/redEnvelope/callback'
  var url = wechat.oauth_client.getAuthorizeURL(auth_callback_url, '', 'snsapi_base');

  console.log("redirectUrl:", url)
  res.redirect(url)
})

router.get('/callback', function (req, res, next) {
  var code = req.query.code
  console.log("code:", code)

  wechat.getAccessToken(code).then((result) => {
    console.log("用户微信信息：", result)
    var accessToken = result.data.access_token;
    var openid = result.data.openid

    res.render('redEnvelope', {
      appId: GLOBAL_CONFIG.LC_APP_ID,
      appKey: GLOBAL_CONFIG.LC_APP_KEY,
      activityId: '59893a8761ff4b0057692905',
    })
  }).catch((error) => {
    console.log(error)
  })

})

module.exports = router;

