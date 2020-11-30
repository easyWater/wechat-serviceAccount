module.exports = {
  "button":[
    {	
        "type":"click",
        "name":"点下试试~",
        "key":"V1001_TODAY_MUSIC"
    },
    {
      "name":"菜单二",
      "sub_button":[
        {	
          "type":"view",
          "name":"百度一下",
          "url":"http://www.baidu.com/"
        },
        {
          "type": "scancode_waitmsg", 
          "name": "扫码带提示", 
          "key": "扫码带提示", 
        }, 
        {
          "type": "scancode_push", 
          "name": "扫码推事件", 
          "key": "扫码推事件", 
        },
        // {
        //   "type": "media_id", 
        //   "name": "图片", 
        //   "media_id": "MEDIA_ID1"
        // }, 
        // {
        //   "type": "view_limited", 
        //   "name": "图文消息", 
        //   "media_id": "MEDIA_ID2"
        // }
      ]
    },{
      "name": "发图", 
      "sub_button": [
        {
          "type": "pic_sysphoto", 
          "name": "系统拍照发图", 
          "key": "系统拍照发图",
        }, 
        {
          "type": "pic_weixin", 
          "name": "微信相册发图", 
          "key": "微信相册发图", 
        },
        {
          "type": "pic_photo_or_album", 
          "name": "拍照或者相册发图", 
          "key": "拍照或者相册发图",
        },         
      ]
    }
  ]
}