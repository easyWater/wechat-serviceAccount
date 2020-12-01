const axios = require('axios')

module.exports = ({ method, url, query, body }) => {

  return new Promise((resolve, reject) => {

    let req = {
      method,
      url,
      baseURL: `https://api.weixin.qq.com/cgi-bin`
    }

    if(query && typeof query === 'object') {
      req.params = query
    }

    if(body && typeof body === 'object') {
      req.data = body
    }

    axios(req).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    }) 

  })

}