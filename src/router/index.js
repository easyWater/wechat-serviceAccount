const express = require('express')
const sha1 = require('sha1')

const Wechat = require('../wechat/wechat')
const { serverUrl } = require('../config/index')
const reply = require('../reply')

const Router = express.Router

const router = new Router()
const wechat = new Wechat()

// 被动回复
router.use(reply())

router.get('/search', async (req, res) => {

  /**
   * 生成JS-SDK权限验证的签名
   * 1.noncestr（随机字符串）, jsapi_ticket, timestamp（时间戳）, url 
   * 2.排序（字典序）后，用&连接。
   * 3.sha1加密
   */
  const { ticket } = await wechat.fetchTicket()

  const jsapi_ticket = ticket
  const noncestr = String(Math.random()).split('.')[1]
  const timestamp = Date.now()
  const url = `${serverUrl}/search`

  const arr = [
    `jsapi_ticket=${jsapi_ticket}`,
    `noncestr=${noncestr}`,
    `timestamp=${timestamp}`,
    `url=${url}`
  ]
  const str = arr.sort().join('&')
  const signature = sha1(str)

  res.render('search', {
    signature,
    noncestr,
    timestamp
  })
})


module.exports = router