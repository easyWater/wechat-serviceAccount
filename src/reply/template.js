module.exports = options => {
  let resXml = `
    <xml>
      <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
      <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
      <CreateTime>${options.createTime}</CreateTime>
      <MsgType><![CDATA[${options.msgType}]]></MsgType>
    `

  switch(options.msgType) {
    case 'text':
      resXml += `<Content><![CDATA[${options.content}]]></Content>`
      break
    case 'image':
      resXml += `<Image>
        <MediaId><![CDATA[${options.mediaId}]]></MediaId>
      </Image>`
      break
    case 'voice':
      resXml += `<Voice>
        <MediaId><![CDATA[${options.mediaId}]]></MediaId>
      </Voice>`
    break
    case 'video':
      resXml += `<Video>
        <MediaId><![CDATA[${options.mediaId}]]></MediaId>
        <Title><![CDATA[${options.title}]]></Title>
        <Description><![CDATA[${options.description}]]></Description>
      </Video>`
    break
    case 'music':
      resXml += `<Music>
        <Title><![CDATA[${options.title}]]></Title>
        <Description><![CDATA[${options.description}]]></Description>
        <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
        <HQMusicUrl><![CDATA[${options.hQMusicUrl}]]></HQMusicUrl>
        <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
      </Music>`
    break
    case 'news':
      resXml += `<ArticleCount>${options.content.length}</ArticleCount>
        <Articles>`

        options.content.forEach(item => {
          resXml += `<item>
            <Title><![CDATA[${item.title}]]></Title>
            <Description><![CDATA[${item.description}]]></Description>
            <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
            <Url><![CDATA[${item.url}]]></Url>
          </item>`
        })
          
        resXml += `</Articles>`
    break
  }

  resXml += `</xml>`

  return resXml
}