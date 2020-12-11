const qiniu = require('qiniu')

// 定义鉴权对象
const accessKey = 'xZLV8hIaH2Ym3xkNCB1tYnzrdQVfv5vSRQnyX6wb'
const secretKey = 'rw9Q6FFF5BchaYU95YqK8MoDVrQT8XsEYJFi5_ez'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

// 配置对象
const config = new qiniu.conf.Config()
// 空间所属地域
config.zone = qiniu.zone.Zone_z2
// 操作对象
const bucketManager = new qiniu.rs.BucketManager(mac, config)
const bucket = 'yy-douban-movie'

module.exports = (resUrl, key) => {
  return new Promise((resolve, reject) => {

    /**
     * resUrl 网络文件地址
     * bucket 空间名称
     * key 存储在七牛中的名称
     */
    
    bucketManager.fetch(resUrl,bucket,key,function (err, respBody, respInfo) {
        if (err) {
          reject('七牛上传失败', err)
        } else {
          if (respInfo.statusCode == 200) {
            console.log('七牛上传成功')
            resolve()
          }
        }
      }
    )
  })
}
