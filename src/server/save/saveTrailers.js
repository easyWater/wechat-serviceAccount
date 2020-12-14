// 引入Trailers模型对象
const Trailers = require('../../model/Trailers')

module.exports = async (data) => {

  for(let i = 0; i < data.length; i++) {
    let item = data[i]

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

    console.log('数据保存成功')
  }
  

}