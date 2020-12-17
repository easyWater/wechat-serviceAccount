/*
读取本地文件
  1.没有文件
    请求access_token，保存在本地，直接使用
  2.有文件，access_token 是否过期
    2.1未过期
      直接使用
    2.2已过期
      重新请求 access_token，覆盖之前文件
*/
const axios = require('axios')
const querystring = require('querystring');
const { resolve } = require('path')
const { createReadStream, createWriteStream } = require('fs')
const request = require('request')

const api = require('../utils/api')
const { appID, appsecret } = require('../config/index')
const menu = require('./menu')
const { writeFileAsync, readFileAsync } = require('../utils/tools')

const ACCESS_TOKEN_URL = 'access_token.txt'
const JSAPI_TICKET_URL = 'jsapi_ticket.txt'

class Wechat {

  constructor() {

  }

  /**
   * 获取access_token
   */
  getAccessToken() {
    return new Promise((resolve, reject) => {
      const query = { grant_type: 'client_credential', appid: appID, secret: appsecret }
      api.getAccessToken(query).then(res => {
        const tokenObj = {
          access_token: res.access_token,
          expires_in: Date.now() + (res.expires_in - 5 * 60) * 1000
        }
        resolve(tokenObj)
      }).catch(err => {
        reject('getAccessToken出错：' + err)
      })
    })    
  }

  /**
   * 保存accessToken
   * @param {*} accessToken 
   */
  saveAccessToken(accessToken) {
    return writeFileAsync(accessToken, ACCESS_TOKEN_URL)
  }

  /**
   * 读取accessToken
   */
  readAccessToken() {
    return readFileAsync(ACCESS_TOKEN_URL)
  }

  /**
   * 检测accessToken是否过期
   * @param {*} data 
   */
  isValidAccessToken(data) {
    if(!data || !data.access_token || !data.expires_in) return false

    return data.expires_in > Date.now()
  }

  /**
   * 返回有效期内的accessToken
   */
  fetchAccessToken() {

    // this上已经存在且有效
    if(this.access_token && this.expires_in && this.isValidAccessToken(this.access_token)) {
      return Promise.resolve({
        access_token: this.access_token,
        expires_in: this.expires_in
      })
    }
    
    //读取本地文件
    return this.readAccessToken().then(async res => {
      //有文件,access_token 是否过期
      if(this.isValidAccessToken(res)) {
        // 未过期
        return Promise.resolve(res)
      }else {
        // 已过期,重新请求access_token,覆盖之前文件
        const res = await this.getAccessToken()
        await this.saveAccessToken(res)
        return Promise.resolve(res)
  
      }
  
    }).catch(async err => {
      //没有文件,请求access_token，保存在本地，直接使用
      const res = await this.getAccessToken()
      await this.saveAccessToken(res)
      return Promise.resolve(res)
    }).then(res => {
      this.access_token = res.access_token
      this.expires_in = res.expires_in

      return Promise.resolve(res)
    })
    
  }

  /**
   * 创建自定义菜单
   */
  createMenu(menu) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.fetchAccessToken()

        const result = await api.createMenu({ access_token: data.access_token }, menu)
        resolve(result)
      }catch(e) {
        reject(`createMenu出错 ${e}`)
      }
    })
  }

  /**
   * 删除自定义菜单
   */
  deleteMenu() {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.fetchAccessToken() 

        const result = await api.deleteMenu({ access_token: data.access_token })
        resolve(result)
      } catch(e) {
        reject(`deleteMenu出错 ${e}`)
      }
    })
  }

  /**
   * 获取ticket
   */
  getTicket() {
    return new Promise(async (resolve, reject) => {
      const data = await this.fetchAccessToken()
      
      const query = { access_token: data.access_token, type: 'jsapi' }
      api.getTicket(query).then(res => {
        const obj = {
          ticket: res.ticket,
          expires_in: Date.now() + (res.expires_in - 5 * 60) * 1000
        }
        resolve(obj)
      }).catch(err => {
        reject('getTicket出错：' + err)
      })
    })    
  }

  /**
   * 保存ticket
   * @param {*} ticket 
   */
  saveTicket (ticket) {
    return writeFileAsync(ticket, JSAPI_TICKET_URL)
  }

  /**
   * 读取ticket
   */
  readTicket() {
    return readFileAsync(JSAPI_TICKET_URL)
  }

  /**
   * 检测ticket是否过期
   * @param {*} data 
   */
  isValidTicket(data) {
    if(!data || !data.ticket || !data.expires_in) return false

    return data.expires_in > Date.now()
  }

  /**
   * 返回有效期内的ticket
   */
  fetchTicket() {

    // this上已经存在且有效
    if(this.ticket && this.ticket_expires_in && this.isValidTicket(this.ticket)) {
      return Promise.resolve({
        ticket: this.ticket,
        expires_in: this.ticket_expires_in
      })
    }
    
    //读取本地文件
    return this.readTicket().then(async res => {
      //有文件,ticket 是否过期
      if(this.isValidTicket(res)) {
        // 未过期
        return Promise.resolve(res)
      }else {
        // 已过期,重新请求ticket,覆盖之前文件
        const res = await this.getTicket()
        await this.saveTicket(res)
        return Promise.resolve(res)
  
      }
  
    }).catch(async err => {
      //没有文件,请求ticket，保存在本地，直接使用
      const res = await this.getTicket()
      await this.saveTicket(res)
      return Promise.resolve(res)
    }).then(res => {
      this.ticket = res.ticket
      this.ticket_expires_in = res.expires_in

      return Promise.resolve(res)
    })
    
  }

  /**
   * 上传临时素材
   */
  uploadTemporaryMedia(type, fileName) {
    // 获取媒体文件的绝对路径
    const filePath = resolve(__dirname, '../media', fileName)

    return new Promise(async (resolve, reject) => {

      try {
        // 获取access_token
        const { access_token } = this.fetchAccessToken()

        const url = `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${access_token}&type=${type}`
        const data = await axios.post(url, querystring.stringify(
          {
            media: createReadStream(filePath)
          }
        ))

        resolve(data.data)
      } catch(e) {
        reject(`uploadTemporaryMedia错误：${e}`)
      }
        
    })    
  }

  /**
   * 获取临时素材
   */
  getTemporaryMedia(type, media_id, fileName) {
    const filePath = resolve(__dirname, '../media', fileName)

    return new Promise(async (resolve, reject) => {
      try{
        const { access_token } = this.fetchAccessToken() 

        const url = `https://api.weixin.qq.com/cgi-bin/media/get?access_token=${access_token}&media_id=${media_id}`
        if(type === 'video') { //视频只支持http协议
          url = url.replace('https', 'http')
          const data = await axios.get(url)
          resolve(data.data)
        }else { //其他类型文件
          request(url).pipe(createWriteStream(filePath)).once('close', resolve)
        }
      } catch(e) {
        reject(`getTemporaryMedia出错：${e}`)
      }
    })
  }
}

// (async () => {
//   const w = new Wechat()

//   // 先删除菜单再创建
//   let result = await w.deleteMenu()
//   console.log('删除菜单：', result)
//   result = await w.createMenu(menu)
//   console.log('创建菜单：', result)

//   // const res = await w.fetchTicket()
//   // console.log('fetchTicket：', res)
// })()

module.exports = Wechat