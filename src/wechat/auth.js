//验证服务器的有效性
const sha1 = require('sha1')

const config = require('../config')
const { getUserDataAsync, parseXmlAsync, formatData } = require('../utils/tools')

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
        
        /**
         * { ToUserName: 'gh_bcbac8e05096',
            FromUserName: 'oVMez5jqL1NwrpRlZ6biSE9NYoIE',
            CreateTime: '1606471448',
            MsgType: 'text',
            Content: '8',
            MsgId: '22999138684859327' }
         */

        let content = '听不到，说大声点儿~'
        if(message.MsgType === 'text') {
          if(message.Content === '1') {
            content = '年轻人不讲武德'
          }else if(message.Content === '2') {
            content = '耗之为汁'
          }else if(message.Content.includes('羊')) {
            content = '找你ba干嘛'
          }
        }

        const resXml = `
        <xml>
          <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
          <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
          <CreateTime>${ Date.now() }</CreateTime>
          <MsgType><![CDATA[text]]></MsgType>
          <Content><![CDATA[${ content }]]></Content>
        </xml>`

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