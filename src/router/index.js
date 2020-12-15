const express = require('express')
const sha1 = require('sha1')

const Wechat = require('../wechat/wechat')
const { serverUrl } = require('../config/index')
const reply = require('../reply')
const db = require('../db')
const Theaters = require('../model/Theaters')
const Trailers = require('../model/Trailers')
const Danmus = require('../model/Danmus')

const Router = express.Router

const router = new Router()
const wechat = new Wechat()

// 被动回复
router.use(reply())

// 搜索页
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

// 详情页
router.get('/detail/:doubanId', async (req, res) => {
  const { doubanId } = req.params

  if(doubanId) {
    // 根据doubanId查询数据并返回
    
    await db
    const data = await Theaters.findOne({ 'doubanId': doubanId }, {_id: 0, __v: 0, createTime: 0, doubanId: 0})

    res.render('detail', { data })

  }else {
    res.end('error')
  }

})

// 预告片页
router.get('/movie', async (req, res) => {
  
  await db
  const data = await Trailers.find({}, {_id: 0, __v: 0})

  res.render('movie', { data, serverUrl })

})

// 获取弹幕
router.get('/v3', async (req, res) => {

  // 获取参数
  const { id } = req.query

  // 查询数据返回
  let dataArr = []
  const data = await Danmus.find({ doubanId: id })
  data.forEach(item => {
    dataArr.push([ item.time, item.type, item.color, item.author, item.text ])
  })

  // 响应
  res.send({
    code: 0,
    data: dataArr
  })
})

// 发送弹幕
router.post('/v3', async (req, res) => {

  // 获取参数
  const { id, author, time, text, color, type } = await new Promise(resolve => {
    let body = ''
    req.on('data', data => {
      body += data.toString()
    }).on('end', () => {
      resolve(JSON.parse(body))
    })
  })

  // 存入库中
  await Danmus.create({
    doubanId: id,
    author,
    time,
    text,
    color,
    type,
  })

  // 响应
  res.send({
    code: 0,
    data: {}
  })
  
})

module.exports = router