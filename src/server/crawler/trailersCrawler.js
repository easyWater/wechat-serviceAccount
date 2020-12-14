const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/coming'

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
  // 1.爬取预告片详情地址
  const result = await page.evaluate(() => {
    
    let res = []
    const $trs = $('.coming_list tbody tr')
    for(let i = 0; i < $trs.length; i++) {
      const num = parseInt($($trs[i]).children().last().html())
      if(num > 800) { //想看人数大于800
        const link = $($trs[i]).find('a').attr('href') // 预告片详情地址
        res.push(link)
      }
    }

    return res
  })
  console.log(result)

  // 2.获取详情页中数据
  let movies = []
  for(let i = 0; i < result.length; i++) {
    const url = result[i]

    // 跳转网址
    await page.goto(url, {
      waitUntil: 'networkidle2', //等待网络空闲时，再跳转加载
    })

    // 爬取其他数据
    const itemData = await page.evaluate(() => {

      const title = $('[property="v:itemreviewed"]').html() //标题
      const directors = $('[rel="v:directedBy"]').html() //导演
      // 海报图
      const posters = $('[rel="v:image"]').attr('src')
      // 豆瓣id
      const doubanId = $('.a_show_login.lnk-sharing').attr('share-id')

      const $starrings = $('[rel="v:starring"]')
      let actors = [] //演员
      for(let j = 0; j < 3; j++) {
        actors.push($($starrings[j]).html())
      }

      let genres = [] //类型
      const $genres = $('[property="v:genre"]')
      for(let j = 0; j < $genres.length; j++) {
        genres.push($genres[j].innerText)
      }

      const duration = $('[property="v:runtime"]').html() //片长
      const summary = $('[property="v:summary"]').html().replace(/\s/g, '') // 简介
      const releaseDate = $('[property="v:initialReleaseDate"]')[0].innerText // 上映日期

      const score = $('[property="v:average"]').html() // 评分

      const coverImg = $('.related-pic-video').css('background-image')
      let cover = ''
      if(coverImg) {
        cover = $('.related-pic-video').css('background-image').replace('url("','').replace('")','')   // 预告片头图
      }
      
      const href = $('.related-pic-video').attr('href') // 预告片视频页地址

      return {
        title,
        directors,
        actors,
        genres,
        duration,
        summary,
        releaseDate,
        score,
        cover,
        posters,
        doubanId,
        href
      }
    })

    movies.push(itemData)
    
  }
  console.log(movies)

  // 3.爬取预告片视频
  for(let i = 0; i < movies.length; i++) {
    const url = movies[i].href

    if(url) {
      // 跳转网址
      await page.goto(url, {
        waitUntil: 'networkidle2', //等待网络空闲时，再跳转加载
      })

      // 爬取其他数据
      movies[i].link = await page.evaluate(() => {
        const link = $('video>source').attr('src')
        return link
      })
    }
  }
  console.log(movies)

  // 关闭浏览器
  await browser.close()

  return movies
}