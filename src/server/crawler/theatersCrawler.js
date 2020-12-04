const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/cinema/nowplaying/shenzhen/'

function timeout() {
  return new Promise(resolve => setTimeout(resolve, 2000))
}

module.exports = async () => {
  
  // 打开浏览器
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    // headless: false //是否以无头浏览器形式打开
  })
  // 创建page页
  const page = await browser.newPage()
  // 跳转网址
  await page.goto(url, {
    waitUntil: 'networkidle2', //等待网络空闲时，再跳转加载
  })

  // 网速不好，等待2s再爬取
  await timeout()
  // 爬取数据
  let result = await page.evaluate(() => {
    // 目标页面使用了jquery，所以可以在此处也使用jquery
    let res = []

    const $lists = $('#nowplaying>.mod-bd>.lists>li')
    for(let i = 0; i < 8; i++) {
      const title = $($lists[i]).data('title') //标题
      const score = $($lists[i]).data('score') //评分
      const duration = $($lists[i]).data('duration') //时长
      const directors = $($lists[i]).data('director') //导演
      const actors = $($lists[i]).data('actors') //主演
      const detailsUrl = $($lists[i]).find('.poster>a').attr('href') //详情地址
      const posters = $($lists[i]).find('.poster>a>img').attr('src') //海报
      const doubanId = $($lists[i]).data('subject') //豆瓣id

      res.push({
        title,
        score,
        duration,
        directors,
        actors,
        detailsUrl,
        posters,
        doubanId
      })
    }

    return res
  })
  console.log(result)

  // 获取详情页中其他数据
  for(let i = 0; i < result.length; i++) {

    // 跳转网址
    await page.goto(result[i].detailsUrl, {
      waitUntil: 'networkidle2', //等待网络空闲时，再跳转加载
    })

    // 爬取其他数据
    const otherRes = await page.evaluate(() => {
      let genres = [] //类型
      const $genres = $('[property="v:genre"]')
      for(let j = 0; j < $genres.length; j++) {
        genres.push($genres[j].innerText)
      }

      // 简介
      const summary = $('[property="v:summary"]').html().replace(/\s/g, '')

      // 上映日期
      const releaseDate = $('[property="v:initialReleaseDate"]')[0].innerText

      return {
        genres,
        summary,
        releaseDate
      }
    })

    result[i] = {...result[i], ...otherRes}
    
  }

  console.log(result)

  // 关闭浏览器
  await browser.close()

  return result
}