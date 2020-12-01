const { parseString } = require('xml2js')
const { writeFile, readFile } = require('fs')
const { resolve } = require('path')

module.exports = {

  getUserDataAsync(req) {
    //处理流式数据
    return new Promise((resolve, reject) => {

      let xmlData = ''
      req.on('data', data => {
        // Buffer格式转为字符串，再相加
        xmlData += data.toString()
      })

      req.on('end', () => {
        resolve(xmlData)
      })
    })
  },

  parseXmlAsync(xmlData) {
    return new Promise((resolve, reject) => {
      parseString(xmlData, { trim: true }, (err, data) => {
        if(!err) {
          resolve(data)
        }else {
          reject('parseXmlAsync出错：' + err)
        }
      })
    })
  },

  formatData(jsData) {
    let message = {}

    const obj = jsData.xml
    if(typeof obj === 'object') {
      for (const key in obj) {
        if(Array.isArray(obj[key]) && obj[key].length) {
          message[key] = obj[key][0]
        }
      }
    }

    return message
  },

  writeFileAsync(data, fileName) {

    const filePath = resolve(__dirname, fileName)

    return new Promise((resolve, reject) => {
      writeFile(filePath, JSON.stringify(data), err => {
        if(!err) {
          console.log('保存成功')
          resolve()
        }else {
          reject('writeFileAsync出错：', err)
        }
      })
    })
  },

  readFileAsync(fileName) {

    const filePath = resolve(__dirname, fileName)

    return new Promise((resolve, reject) => {
      readFile(filePath, (err, data) => {
        if(!err) {
          console.log('读取成功')
          resolve(JSON.parse(data))
        }else {
          reject('readFileAsync出错：', err)
        }
      })
    })
  }

}