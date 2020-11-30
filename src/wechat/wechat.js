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
const { writeFile, readFile } = require('fs')

const { appID, appsecret } = require('../config/index')
const ACCESS_TOKEN_URL = './access_token.txt'
const menu = require('./menu')

class Wechat {

  constructor() {

  }

  /**
   * 获取access_token
   */
  getAccessToken() {
    return new Promise((resolve, reject) => {
      const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
      axios.get(url).then(res => {
        const tokenObj = {
          access_token: res.data.access_token,
          expires_in: Date.now() + (res.data.expires_in - 5 * 60) * 1000
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
    return new Promise((resolve, reject) => {
      writeFile(ACCESS_TOKEN_URL, JSON.stringify(accessToken), err => {
        if(!err) {
          console.log('保存accessToken成功')
          resolve()
        }else {
          reject('saveAccessToken出错：', err)
        }
      })
    })
  }

  /**
   * 读取accessToken
   */
  readAccessToken() {
    return new Promise((resolve, reject) => {
      readFile(ACCESS_TOKEN_URL, (err, data) => {
        if(!err) {
          console.log('读取accessToken成功')
          resolve(JSON.parse(data))
        }else {
          reject('readAccessToken出错：', err)
        }
      })
    })
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
        const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`

        const result = await axios({method: 'post', url, data: menu})
        resolve(result.data)
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
        const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`

        const result = await axios({method: 'get', url})
        resolve(result.data)
      } catch(e) {
        reject(`deleteMenu出错 ${e}`)
      }
    })
  }
  
}

(async () => {
  const w = new Wechat()

  // 先删除菜单再创建
  let result = await w.deleteMenu()
  console.log('删除菜单：', result)
  result = await w.createMenu(menu)
  console.log('创建菜单：', result)
})()