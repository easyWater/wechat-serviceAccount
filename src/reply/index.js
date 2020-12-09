//验证服务器的有效性
const sha1 = require('sha1')

const config = require('../config')
const { getUserDataAsync, parseXmlAsync, formatData } = require('../utils/tools')
const template = require('./template')
const reply = require('./reply')

module.exports = () => {
  return async (req, res, next) => {
    const { token } = config
    const { timestamp, nonce, signature, echostr } = req.query
    // console.log('method: ', req.method)
    // console.log('query: ', req.query)

    const sha1Str = sha1([token, timestamp, nonce].sort().join(''))

    if(req.method === 'GET') {// get请求验证服务器有效性

      if(sha1Str === signature) {
        res.send(echostr)
      }else {
        res.send('error')
      }

    }else if(req.method === 'POST') { // post请求发送用户信息

      // 消息是否来自微信
      if(sha1Str === signature) {
      
        const xmlData = await getUserDataAsync(req)
        
        const jsData = await parseXmlAsync(xmlData)
        
        const message = formatData(jsData)

        const options = await reply(message)
        
        const resXml = template(options)

        res.send(resXml)

        // res.send('')

      }else {
        res.send('error')
      }

    }else { // 其他请求方式不处理
      res.send('error')
    }

  }
}