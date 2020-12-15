// 根据用户发送的类型及内容设置被动回复
const db = require('../db');
const Theaters = require('../model/Theaters')
const { serverUrl } = require('../config')

module.exports = async message => {

  let options = {
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName,
    createTime: Date.now(),
    msgType:'text',
  }

  let content = '听不到，大声点~'
  
  if(message.MsgType === 'text') {
    
    if(message.Content === '热门') {
      // 查询数据返回图文消息
      
      await db // 连接数据库
      const data = await Theaters.find({}, {title: 1, summary: 1, posters: 1, doubanId: 1, _id: 0})
      
      options.msgType = 'news'
      content = []

      for(let i = 0; i < data.length; i++) {
        content.push({
          title: data[i].title,
          description: data[i].summary,
          picUrl: data[i].posters,
          url: `${serverUrl}/detail/${data[i].doubanId}`, //详情地址
        })
      }
      
    }else if(message.Content === '首页') {

      options.msgType = 'news'
      content = [{
        title: '电影抢先看',
        description: '这里有最新的电影资讯',
        picUrl: 'https://img3.doubanio.com/dae/accounts/resources/19870c3/movie/assets/lg_movie_a12_2.png',
        url: `${serverUrl}/movie`, //详情地址
      }]

    }else {
      // 关键词搜索 message.Content

      await db // 连接数据库
      const data = await Theaters.find({'title': {$regex: eval("/"+ message.Content +"/i")}}, {title: 1, summary: 1, posters: 1, doubanId: 1, _id: 0})

      if(data.length) {
        options.msgType = 'news'
        content = []

        for(let i = 0; i < data.length; i++) {
          content.push({
            title: data[i].title,
            description: data[i].summary,
            picUrl: data[i].posters,
            url: `${serverUrl}/detail/${data[i].doubanId}`, //详情地址
          })
        }
      }else {
        content = '暂时没有找到你要的信息~'
      }
      
    }
    
  }else if(message.MsgType === 'voice') { //语音搜索

    await db // 连接数据库
    const data = await Theaters.find({'title': {$regex: eval("/"+ message.Recognition +"/i")}}, {title: 1, summary: 1, posters: 1, doubanId: 1, _id: 0})
    
    if(data.length) {
      options.msgType = 'news'
      content = []

      for(let i = 0; i < data.length; i++) {
        content.push({
          title: data[i].title,
          description: data[i].summary,
          picUrl: data[i].posters,
          url: `${serverUrl}/detail/${data[i].doubanId}`, //详情地址
        })
      }
    }else {
      content = '暂时没有找到你要的信息~'
    }
    

  }else if(message.MsgType === 'event') {
    // 接收事件推送
    if(message.Event === 'subscribe') { //订阅事件的推送
      content = `欢迎关注昂~
      回复 首页 查看电影预告片
      回复 热门 查看最新最热门的电影
      回复 文本 搜索电影信息
      回复 语音 搜索电影信息
      也可点击下方菜单按钮，了解更多功能
      `
    }else if(message.Event === 'unsubscribe') { //取消订阅事件的推送
      // 取消订阅，用户接收不到推送消息了
      console.log('无情取关~')
    }else if(message.Event === 'CLICK') {
      // 自定义菜单事件
      content = `您可以按照以下提示进行操作
      回复 首页 查看电影预告片
      回复 热门 查看最新最热门的电影
      回复 文本 搜索电影信息
      回复 语音 搜索电影信息
      也可点击下方菜单按钮，了解更多功能
      `
    }else if(message.Event === 'LOCATION') { //上报地理位置
      content = ''
    }
  }

  options.content = content  

  return options
}