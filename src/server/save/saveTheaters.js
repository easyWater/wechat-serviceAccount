// 引入Theaters模型对象
const Theaters = require('../../model/Theaters')

module.exports = async (data) => {

  for(let i = 0; i < data.length; i++) {
    let item = data[i]

    try {
      // 当前数据有没有在数据库中，没有则新增一条，有则更新
      const searchRes = await Theaters.findOne({ doubanId: item.doubanId })
      if(!searchRes) {
        await Theaters.create({
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
        })

        console.log('Theaters 数据创建成功')
      }else {
        await Theaters.updateOne({doubanId: item.doubanId}, {
          title: item.title,
          score: item.score,
          duration: item.duration,
          directors: item.directors,
          actors: item.actors,
          posters: item.posters,
          genres: item.genres,
          summary: item.summary,
          releaseDate: item.releaseDate,
        });

        console.log('Theaters 数据更新成功')
      }
    }catch(e) {
      console.log(`Theaters 错误：${e}`)
    }
  }
  

}