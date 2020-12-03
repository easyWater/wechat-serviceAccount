// 根据用户发送的类型及内容设置被动回复

module.exports = message => {

  let options = {
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName,
    createTime: Date.now(),
    msgType:'text',
  }

  let content = '听不到，说大声点儿~'
  if(message.MsgType === 'text') {
    
    if(message.Content === '1') {
      content = '年轻人不讲武德'
    }else if(message.Content === '2') {
      content = '耗之为汁'
    }else if(message.Content.includes('羊')) {
      content = '找你ba干嘛'
    }
    
  }else if(message.MsgType === 'voice') {
    options.msgType = 'voice'
    options.mediaId = message.MediaID
    console.log('识别语音消息：', message.Recognition)
  }else if(message.MsgType === 'event') {
    // 接收事件推送
    if(message.Event === 'subscribe') { //订阅事件的推送
      content = `欢迎关注昂~
      回复 首页 能看到电影预告片页面
      回复 热门 能看到最新最热门的电影
      回复 文本 查看指定的电影信息
      回复 语音 查看指定的电影信息
      也可点击下方菜单按钮，了解更多功能
      `
    }else if(message.Event === 'unsubscribe') { //取消订阅事件的推送
      // 取消订阅，用户接收不到推送消息了
      console.log('无情取关~')
    }else if(message.Event === 'CLICK') {
      // 自定义菜单事件
      content = `您可以按照以下提示进行操作
      回复 首页 能看到电影预告片页面
      回复 热门 能看到最新最热门的电影
      回复 文本 查看指定的电影信息
      回复 语音 查看指定的电影信息
      也可点击下方菜单按钮，了解更多功能
      `
    }
  }

  options.content = content  

  return options
}