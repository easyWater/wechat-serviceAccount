const { nanoid } = require('nanoid')

const Theaters = require('../../model/Theaters')
const upload = require('./upload')

module.exports = async () => {
  // 查询没有上传在七牛中的数据
  const movies = await Theaters.find({$or: [{posterKey: ''}, {posterKey: null} ,{posterKey: {$exists: false}}]})
  
  movies.forEach(async movie => {
    const resUrl = movie.posters
    const key = `${nanoid(10)}.jpg`
    
    // 上传七牛中
    await upload(resUrl, key)

    // 将key存入库中
    movie.posterKey = key
    await movie.save()
  })
}