const { serverUrl } = require('../config')

module.exports = {
  "button":[
    {	
        "type":"view",
        "name":"电影☀",
        "url":`${serverUrl}/movie`
    },
    {
      "type":"view",
      "name":"语音搜索🎤",
      "url":`${serverUrl}/search`
    },{
      "name": "更多🌟", 
      "sub_button": [
        {
          "type": "view", 
          "name": "了解官网👄", 
          "url":"https://movie.douban.com/"
        }, 
        {
          "type": "click", 
          "name": "帮助🙋", 
          "key": "help", 
        }
      ]
    }
  ]
}