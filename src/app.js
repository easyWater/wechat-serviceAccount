const express = require('express')
const sha1 = require('sha1')

const auth = require('./wechat/auth')
const Wechat = require('./wechat/wechat')
const { url } = require('./config/index')

const app = express()

const wechat = new Wechat()

// 配置模板资源目录
app.set('views', './views')
// 配置模板引擎
app.set('view engine', 'ejs')

// 路由
app.get('/search', async (req, res) => {

  /**
   * 生成JS-SDK权限验证的签名
   * 1.noncestr（随机字符串）, jsapi_ticket, timestamp（时间戳）, url 
   * 2.排序（字典序）后，用&连接。
   * 3.sha1加密
   */
  const { ticket } = await wechat.fetchTicket()

  const jsapi_ticket = ticket
  const noncestr = Math.random().split('.')[1]
  const timestamp = Date.now()
  const url = `${url}/search`

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

// 中间件
app.use(auth())

app.listen(3000, () => console.log('服务器启动成功，3000端口开启~'))