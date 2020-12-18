// 引入Trailers模型对象
const Trailers = require('../../model/Trailers')

module.exports = async (data) => {

  for(let i = 0; i < data.length; i++) {
    let item = data[i]

    try {
      // 当前数据有没有在数据库中，没有则新增一条，有则更新
      const searchRes = await Trailers.findOne({ doubanId: item.doubanId })
      if(!searchRes) {
        await Trailers.create({
          title: item.title,
          score: item.score,
          duration: item.duration,
          directors: item.directors,
          actors: item.actors,
          posters: item.posters,
          genres: item.genres,
          summary: item.summary,
          doubanId: item.doubanId,
          releaseDate: item.releaseDate,
          cover: item.cover,
          link: item.link,
        })
    
        console.log('Trailers 数据创建成功')

      }else {
        await Trailers.updateOne({ doubanId: item.doubanId }, {
          title: item.title,
          score: item.score,
          duration: item.duration,
          directors: item.directors,
          actors: item.actors,
          posters: item.posters,
          genres: item.genres,
          summary: item.summary,
          releaseDate: item.releaseDate,
          cover: item.cover,
          link: item.link,
        })

        console.log('Trailers 数据更新成功')

      }
    }catch(e) {
      console.log(`Trailers 错误：${e}`)
    }
  }
  

}