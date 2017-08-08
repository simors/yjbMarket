/**
 * Created by wanpeng on 2017/8/8.
 */
var OAuth = require('wechat-oauth');
var GLOBAL_CONFIG = require('../config')
var mysqlUtil = require('../common/mysqlUtil')
var Promise = require('bluebird')

var oauth_client = new OAuth(GLOBAL_CONFIG.WECHAT_MP_APPID, GLOBAL_CONFIG.WECHAT_MP_APPSECRET, getOauthTokenFromMysql, setOauthTokenToMysql)

function getAccessToken(code) {
  return new Promise(function (resolve, reject) {
    oauth_client.getAccessToken(code, function (err, result) {
      if(err) {
        console.log("获取微信授权access_token失败")
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

function getOauthTokenFromMysql(openid, callback) {
  var sql = ""
  var mysqlConn = undefined

  mysqlUtil.getConnection().then((conn) => {
    mysqlConn = conn
    sql = 'SELECT * FROM token WHERE openid = ?'
    return mysqlUtil.query(conn, sql, [openid])
  }).then((queryRes) => {
    callback(null, queryRes.results[0])
  }).catch((error) => {
    callback(error)
  }).finally(() => {
    if (mysqlConn) {
      mysqlUtil.release(mysqlConn)
    }
  })
}

function setOauthTokenToMysql(openid, token, callback) {
  var sql = ""
  var mysqlConn = undefined

  mysqlUtil.getConnection().then((conn) => {
    sql = 'REPLACE INTO token(access_token, expires_in, refresh_token, openid, scope, create_at) VALUES(?, ?, ?, ?, ?, ?)';
    var fields = [token.access_token, token.expires_in, token.refresh_token, token.openid, token.scope, token.create_at];
    return mysqlUtil.query(conn, sql, fields)
  }).then(() => {
    callback()
  }).catch((error) => {
    callback(error)
  }).finally(() => {
    if (mysqlConn) {
      mysqlUtil.release(mysqlConn)
    }
  })
}

module.exports = {
  oauth_client: oauth_client,
  getAccessToken: getAccessToken,
}