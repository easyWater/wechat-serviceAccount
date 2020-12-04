// 引入Theaters模型对象
const Theaters = require('../../model/Theaters')

module.exports = async (data) => {

  for(let i = 0; i < data.length; i++) {
    let item = data[i]

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

    console.log('数据保存成功')
  }
  

}